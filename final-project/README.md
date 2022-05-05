# Pokemon Monte Carlo Simulation

## Background

Welcome to my final project for Automated Decision Systems at Yale! For this project, I've decided to apply Monte Carlo simulation on Pokemon, a turn-based battle game in which two Pokemon fight until one is knocked out. A Pokemon is knocked out when their HP reaches 0. I grew up playing this game, and thought it might be an interesting application of Monte Carlo simulation since it is surprisingly complex. There are even many competitive ESports tournaments oriented around the game at a very high level of competitive play. Many moves have consequences that can last throughout the duration of the battle, so I thought it would be interesting to see how well simulations could capture the optimal strategies for these cute little monsters.

If you've never played a Pokemon game before, check out [this video](https://www.youtube.com/watch?v=G4u-1EI13y8).

## Simulation

This project simulates a battle between a Pokemon called Gliscor (left) and Snorlax (right). For the sake of the project, these are the only Pokemon available for the simulation, though the code is written in a way where adding other Pokemon would be pretty easy in the future.

<div style="display:flex; padding: 30px;">
<img width="120" alt="Gliscor" src="https://static.wikia.nocookie.net/vsbattles/images/5/5b/472.png/revision/latest?cb=20160521201947">
<img width="140" alt="Snorlax" src="https://images.gameinfo.io/pokemon/256/p143f157.webp">
</div>

I chose Gliscor as the basis for the simulation since there is an optimal strategy with Gliscor. The optimal strategy is to inflict poison on the enemy as soon as possible, and then last as long as possible by spamming heals when necessary and attacking otherwise. I chose Snorlax as the opposing Pokemon since it is known for being a strong defensive pick, therefore making sure that the battles will last enough time for the Gliscor poison strategy to actually matter.

## Tools, Frameworks, Languages

I wrote the simulation as a Node.js CLI (using [commander](https://www.npmjs.com/package/commander)) in Typescript. Writing a CLI for this project made it super easy to run more simulations and view overall outcome statistics on the terminal. I chose to write the simulation using TypeScript since I've been using Python the entire course and thought this would be a refreshing language to work with.

I'm also very familiar with database libraries in TypeScript (particularly [TypeORM](https://www.npmjs.com/package/typeorm)). This was super useful since this project uses Postgres to store most large datasets including outcomes of simulations and the generated Monte Carlo decision table. I chose to use a robust database for this instead of storing these results in-memory because the state tree for Pokemon can be a lot larger than BlackJack, so the chances are I would need to run and persist more simulation outcomes quite frequently. Having these in a database allows me to expand existing datasets without having to rerun N simulations at once.

## Simulation Implementation

I decided to take an object-oriented approach to writing the game simulation since I was doing everything from scratch and this seemed to be the most intuitive way of managing game states. Pokemon implement a common Pokemon interface, and vary in their state and available methods (attack moves). These Pokemon implementations are stored in `src/pokemon`. Only Gliscor and Snorlax were implemented for the scope of this project. Here is what Gliscor looks like:

```typescript
import { Ability, CurrentStatus, Item, Move, Pokemon, Status } from "./types";
import { calculateSpecialAttackDamage } from "./utils";

export class Gliscor implements Pokemon {
  public name: string;

  public totalHp: number;
  public attack: number;
  public defense: number;
  public spAttack: number;
  public spDefense: number;
  public speed: number;
  public ability: Ability;

  public currentHp: number;
  public status: CurrentStatus | null;
  public item: Item | null;
  public isProtected: boolean;

  public move1: Move;
  public move2: Move;
  public move3: Move;
  public move4: Move;

  public constructor(item: Item | null = null) {
    this.name = "Gliscor";

    /**
     * Stats taken from Smogon:
     * https://www.smogon.com/dex/sm/pokemon/gliscor/battle-spot-singles/
     */
    this.totalHp = 75;
    this.attack = 95;
    this.defense = 125;
    this.spAttack = 45;
    this.spDefense = 75;
    this.speed = 95;
    this.ability = Ability.PoisonHeal;

    this.currentHp = this.totalHp;
    this.status = null;
    this.item = item;
    this.isProtected = false;

    this.move1 = {
      name: "Earthquake",
      currentPP: 10,
      totalPP: 10,
      power: 100,
      use: (pokemon: Pokemon) => {
        const damage = calculateSpecialAttackDamage(
          this.move1.power!,
          this,
          pokemon
        );
        pokemon.currentHp = Math.max(0, pokemon.currentHp - damage);
      },
    };

    this.move2 = {
      name: "Roost",
      currentPP: 14,
      totalPP: 14,
      use: (_pokemon: Pokemon) => {
        const healAmount = Math.round(this.totalHp / 2);
        this.currentHp = Math.min(this.currentHp + healAmount, this.totalHp);
      },
    };

    this.move3 = {
      name: "Protect",
      currentPP: 10,
      totalPP: 10,
      use: (_pokemon: Pokemon) => {
        this.isProtected = true;
      },
    };

    this.move4 = {
      name: "Toxic",
      currentPP: 12,
      totalPP: 12,
      use: (pokemon: Pokemon) => {
        if (!pokemon.status) {
          pokemon.status = {
            status: Status.Poisoned,
            turnsPassedSinceInflicted: 0,
          };
        }
      },
    };
  }
}
```

Battles are conducted through the `battle` function (defined in `src/cli/battle/battle.ts`), which takes two Pokemon as an input (as well as some options for what strategy to use + verbose logging). The Battle is responsible for handling the turns and updating each Pokemon's state according to various game rules (ex. status ailments, item effects, etc.). The very abstract interface of this function makes it very easy to implement new Pokemon and have them battle, as it is unspecific to the context of the Pokemon battling.

Battles return outcome objects, which represent the outcome of the simulated battle. In addition, it returns the tracked moves that each Pokemon took during the battle, which can be used to construct a Monte Carlo decision table.

```typescript
import { battle } from "../battle/battle";
const result = await battle(gliscor, snorlax);

/**
 * result looks like:
 * {
 *    outcome: "winner",
 *    winner: <GliscorPokemonInstance>,
 *    pokemon1TrackedMoves: [...],
 *    pokemon2TrackedMoves: [...]
 * }
 * /
```

While `battle` is an extremely easy method to call, it is the most complicated function in the entire project, as it handles all of the game state. It has a lot of utility functions in `src/cli/battle/utils.ts` in order to abstract some of the game functions away. I added lots of comments to these functions so it is definitely work taking a peek at the implementation of `battle`.

## Simulation Tests

There are a lot of subtle specifics on how a Pokemon battle is managed (e.g, how status ailments/item effects are applied), so to make sure I didn't introduce bugs anywhere I wrote several unit tests. These tests are available in `__tests__` in the root directory. I wrote these tests using the [Jest](https://jestjs.io/), which is the industry standard testing framework for TypeScript.

I wrote tests for both the individual Pokemon moves (e.g, Gliscor using Earthquake), as well as for a lot of the utility functions for the `battle` function implementation. This ended up being super helpful for catching bugs. I also set up a GitHub action on [my repository](https://github.com/wu-json/CPSC-458/tree/main/final-project) to ensure tests would be run every time I committed to main.

To run the tests manually, simply run the following:

```bash
# install packages if you haven't already
yarn

# run tests
yarn test
```

## Writing the Project CLI

Using the Commander npm package organizing the CLI code was rather straightforward. Implementations for commands can be found in `src/cli/commands`. Each command has its own file. I also made it such that some commands make a connection to the Postgres database, meaning that saving game outcomes or pulling Monte Carlo decisions can be done within the command implementations.

To view more info on the CLI, you can run the following

```bash
yarn cli --help

Commands:
  generate-monte-carlo-rows [battles]  Simulate random strategy battles and save them as Monte Carlo rows.
  sim-monte-carlo-battles [battles]    Simulate monte carlo strategy battles and save their results into Postgres
  sim-random-battles [battles]         Simulate random strategy battles and save their results into Postgres
  sim-verbose-random-battle            Simulate a verbose random battle
  sim-verbose-monte-carlo-battle       Simulate a verbose monte carlo battle
  view-monte-carlo-battle-stats        See an overview of the win rates of Gliscor vs. Snorlax
  view-random-battle-stats             See an overview of the win rates of Gliscor vs. Snorlax
  help [command]                       display help for command
```

## How to Run the CLI Yourself

Before you run the CLI yourself, you will need to have the following requirements set up:

- [Yarn](https://yarnpkg.com/getting-started/install)
- [Docker](https://docs.docker.com/get-docker/)

To run real commands on the CLI, you will need to run the following commands first to install packages and set up a local Postgres instance:

```bash
# install packages
yarn

# start local postgres (leave this running)
docker-compose up
```

Once you have the above set up, you are ready to start using the CLI!

## Observing a Simulation With Random Strategy

Before we start doing any of the Monte Carlo stuff, it helps to see what a battle simulation looks like in action. To run a simple battle between Snorlax and Gliscor, run this command:

```bash
yarn cli sim-verbose-random-battle

# output
---------------------------------------------------
Turn: 0, Gliscor: 75 hp, Snorlax: 160 hp
Gliscor used Protect.
Snorlax healed 0 hp from leftovers.
---------------------------------------------------
Turn: 1, Gliscor: 75 hp, Snorlax: 160 hp
Snorlax used Body Slam but Gliscor protected itself.
---------------------------------------------------
Turn: 2, Gliscor: 75 hp, Snorlax: 160 hp
Gliscor used Protect.
Snorlax healed 0 hp from leftovers.
---------------------------------------------------
Turn: 3, Gliscor: 75 hp, Snorlax: 160 hp
Snorlax used Crunch but Gliscor protected itself.
---------------------------------------------------
Turn: 4, Gliscor: 75 hp, Snorlax: 160 hp
Gliscor used Toxic.
Snorlax is now inflicted with status: Poisoned.
Snorlax lost 10 hp from poison.
Snorlax healed 10 hp from leftovers.
---------------------------------------------------
Turn: 5, Gliscor: 75 hp, Snorlax: 160 hp
Snorlax used Crunch and dealt 19 hp of damage.
---------------------------------------------------
Turn: 6, Gliscor: 56 hp, Snorlax: 160 hp
Gliscor used Earthquake and dealt 12 hp of damage.
Snorlax lost 20 hp from poison.
Snorlax healed 10 hp from leftovers.
---------------------------------------------------
Turn: 7, Gliscor: 56 hp, Snorlax: 138 hp
Snorlax used Fire Punch and dealt 18 hp of damage.
---------------------------------------------------
Turn: 8, Gliscor: 38 hp, Snorlax: 138 hp
Gliscor used Protect.
Snorlax lost 30 hp from poison.
Snorlax healed 10 hp from leftovers.
---------------------------------------------------
Turn: 9, Gliscor: 38 hp, Snorlax: 118 hp
Snorlax used Fire Punch but Gliscor protected itself.
---------------------------------------------------
Turn: 10, Gliscor: 38 hp, Snorlax: 118 hp
Gliscor used Toxic.
Snorlax lost 40 hp from poison.
Snorlax healed 10 hp from leftovers.
---------------------------------------------------
Turn: 11, Gliscor: 38 hp, Snorlax: 88 hp
Snorlax used Fire Punch and dealt 18 hp of damage.
---------------------------------------------------
Turn: 12, Gliscor: 20 hp, Snorlax: 88 hp
Gliscor used Protect.
Snorlax lost 50 hp from poison.
Snorlax healed 10 hp from leftovers.
---------------------------------------------------
Turn: 13, Gliscor: 20 hp, Snorlax: 48 hp
Snorlax used Crunch but Gliscor protected itself.
---------------------------------------------------
Turn: 14, Gliscor: 20 hp, Snorlax: 48 hp
Gliscor used Earthquake and dealt 12 hp of damage.
Snorlax lost 36 hp from poison.
---------------------------------
Outcome: Gliscor won with 20 hp remaining!
✨  Done in 5.02s.
```

Notice that you get a full transcript of the turn breakdowns and what moves were used. Each turn also shows the current HP of each Pokemon, which can give you a sense of how the battle is progressing at a given turn. This command is nice since it also allows us to verify that the simulation is working correctly. I used this command several times while debugging the initial simulation code.

## Gliscor vs. Snorlax Statistics With Random Strategy

Before we start on the Monte Carlo stuff, we also want to see the outcome statistics in battles between Gliscor and Snorlax when both Pokemon are using a random strategy. This is because we need some base statistics to compare how effective the Monte Carlo strategy will be for Gliscor later. To accomplish this, run the following command:

```bash
yarn cli sim-random-battles 100000

# output
...
---------------------------------
100000 total battles.
Gliscor won 42397 times (42.397% win rate).
Snorlax won 52577 times (52.577% win rate).
Ended in a draw 5026 times (5.026% draw rate).
---------------------------------
```

The command above runs 100,000 simulated games where both Pokemon are using random strategies for picking moves, and then saves each outcome in Postgres in the `random_strategy_outcome` table. Afterwards, it aggregates the outcomes to calculate the stats above. You can view these stats again by running:

```bash
yarn cli view-random-battle-stats
```

Notice that Gliscor only seems to have a win-rate of around `42.397%` while using a random strategy. This is probably because as we mentioned in the beginning, Gliscor has a very specific strategy necessary in order to be effective:

1. Poison the enemy Pokemon as soon as possible.
2. Stall and inflict damage.

In a random strategy, Gliscor probably won't follow the steps above. Instead, it will probably make ineffective decisions (e.g not poisoning the enemy Pokemon as early as possible) that will result in it losing most of the time. Snorlax on the other hand, has a much less predominant strategy, as most of his moves deal constant damage. Thus, it makes sense why Snorlax would perform better even by randomly selecting moves.

The question here becomes the following: will a Monte Carlo decision table eventually learn the optimal Gliscor strategy? Let's try it out to find out.

## Defining a Monte Carlo Table for Gliscor

To generate a Monte Carlo table for Gliscor, we need to first decide on an index of the current situation to use for the table. A Monte Carlo table works by checking `win rates` of different `moves/choices` made in different `situations`, and choosing the best one. This means we must first define a situation in our design of the table.

We use the following definition for situation:

```bash
# format
gliscor-hp:snorlax-hp:gliscor-status-ailment:snorlax-status-ailment

# example situations
37:158:undefined:undefined
37:160:undefined:Sleep
57:150:undefined:Poisoned
```

We use the above definition of a situation because HP and status are the most critical factors for making a decision in the Gliscor strategy. If the opponent is poisoned, Gliscor should focus on stalling. If the opponent is high HP and has no status ailment, Gliscor should focus on poisoning. Consequently, the above would be a great index for defining a situation in which moves can be made.

The table structure in Postgres is defined in `src/entity/MonteCarlo.ts`. Note how situation, pokemon name, and moves are indexed in order to make queries faster for running the Monte Carlo strategy.

## Populating the Monte Carlo Table

To populate the Monte Carlo table, we need to run a bunch of random choice simulations, and then store each decision Gliscor makes in the battle along with the outcome of the battle. This is thankfully easy since `battle` returns the tracked moves of each Pokemon after the battle, which allows us to iterate and save these decisions with the outcome.

To populate the Monte Carlo table, run this command:

```bash
yarn cli generate-monte-carlo-rows 100000

# output
---------------------------------
Initializing data source...
Data source initialized.
---------------------------------
Simulating 100000 battles.
 ████████████████████████████████████████ 100% | ETA: 0s | 100000/100000
---------------------------------
Finished adding rows to Monte Carlo table.
---------------------------------
```

This command takes a lot of time because of the queries and updates involved with populating the table rows. I ran the above overnight and it generated around 12,000 total rows. If you don't want to wait that long but still want to see the data, I have a data dump with my Postgres data you can import. The instructions for this are at the very end of this ReadMe.

## Seeing the Monte Carlo Strategy In Action

Now that the Monte Carlo table has been populated, we can run a battle simulation in which Gliscor uses the decision table to pick moves. The algorithm is as follows:

1. Given the current situation, look up the Monte Carlo rows in Postgres.

2. Calculate the win rate of each decision made in the situation and choose the highest one that is available (the move hasn't run out of PP and can still be used).

3. Repeat!

To do the above, run this command:

```bash
yarn cli sim-verbose-monte-carlo-battle

# output
---------------------------------
Initializing data source...
Data source initialized.
---------------------------------
Note that monte carlo strategy only works for Gliscor. When useMonteCarloStrategy is set to true, Snorlax will still use a random strategy.
---------------------------------------------------
Turn: 0, Gliscor: 75 hp, Snorlax: 160 hp
Monte Carlo: Best move for Gliscor here is Toxic, with win rate of 50.7696751477846%
Gliscor used Toxic.
Snorlax is now inflicted with status: Poisoned.
Snorlax lost 10 hp from poison.
Snorlax healed 10 hp from leftovers.
---------------------------------------------------
Turn: 1, Gliscor: 75 hp, Snorlax: 160 hp
Snorlax used Rest.
---------------------------------------------------
Turn: 2, Gliscor: 75 hp, Snorlax: 160 hp
Monte Carlo: Best move for Gliscor here is Protect, with win rate of 42.62851764705882%
Gliscor used Protect.
Snorlax healed 0 hp from leftovers.
---------------------------------------------------
Turn: 3, Gliscor: 75 hp, Snorlax: 160 hp
Snorlax is fast asleep.
---------------------------------------------------
Turn: 4, Gliscor: 75 hp, Snorlax: 160 hp
Monte Carlo: Best move for Gliscor here is Protect, with win rate of 42.62851764705882%
Gliscor used Protect.
Snorlax healed 0 hp from leftovers.
---------------------------------------------------
Turn: 5, Gliscor: 75 hp, Snorlax: 160 hp
Snorlax is fast asleep.
---------------------------------------------------
Turn: 6, Gliscor: 75 hp, Snorlax: 160 hp
Monte Carlo: Best move for Gliscor here is Protect, with win rate of 42.62851764705882%
Gliscor used Protect.
Snorlax healed 0 hp from leftovers.
---------------------------------------------------
Turn: 7, Gliscor: 75 hp, Snorlax: 160 hp
Snorlax woke up from sleep!
Snorlax used Crunch but Gliscor protected itself.
---------------------------------------------------
Turn: 8, Gliscor: 75 hp, Snorlax: 160 hp
Monte Carlo: Best move for Gliscor here is Toxic, with win rate of 50.7696751477846%
Gliscor used Toxic.
Snorlax is now inflicted with status: Poisoned.
Snorlax lost 10 hp from poison.
Snorlax healed 10 hp from leftovers.
---------------------------------------------------
Turn: 9, Gliscor: 75 hp, Snorlax: 160 hp
Snorlax used Body Slam and dealt 13 hp of damage.
---------------------------------------------------
Turn: 10, Gliscor: 62 hp, Snorlax: 160 hp
Monte Carlo: Best move for Gliscor here is Roost, with win rate of 56.6248574686431%
Gliscor used Roost and healed 13 hp.
Snorlax lost 20 hp from poison.
Snorlax healed 10 hp from leftovers.
---------------------------------------------------
Turn: 11, Gliscor: 75 hp, Snorlax: 150 hp
Snorlax used Fire Punch and dealt 18 hp of damage.
---------------------------------------------------
Turn: 12, Gliscor: 57 hp, Snorlax: 150 hp
Monte Carlo: Best move for Gliscor here is Roost, with win rate of 62.774836220048456%
Gliscor used Roost and healed 18 hp.
Snorlax lost 30 hp from poison.
Snorlax healed 10 hp from leftovers.
---------------------------------------------------
Turn: 13, Gliscor: 75 hp, Snorlax: 130 hp
Snorlax used Fire Punch and dealt 18 hp of damage.
---------------------------------------------------
Turn: 14, Gliscor: 57 hp, Snorlax: 130 hp
Monte Carlo: Best move for Gliscor here is Protect, with win rate of 72.15644061715106%
Gliscor used Protect.
Snorlax lost 40 hp from poison.
Snorlax healed 10 hp from leftovers.
---------------------------------------------------
Turn: 15, Gliscor: 57 hp, Snorlax: 100 hp
Snorlax used Rest and healed 60 hp.
---------------------------------------------------
Turn: 16, Gliscor: 57 hp, Snorlax: 160 hp
Monte Carlo: Best move for Gliscor here is Protect, with win rate of 39.22008154746951%
Gliscor used Protect.
Snorlax healed 0 hp from leftovers.
---------------------------------------------------
Turn: 17, Gliscor: 57 hp, Snorlax: 160 hp
Snorlax woke up from sleep!
Snorlax used Body Slam but Gliscor protected itself.
---------------------------------------------------
Turn: 18, Gliscor: 57 hp, Snorlax: 160 hp
Monte Carlo: Best move for Gliscor here is Toxic, with win rate of 42.73748320383245%
Gliscor used Toxic.
Snorlax is now inflicted with status: Poisoned.
Snorlax lost 10 hp from poison.
Snorlax healed 10 hp from leftovers.
---------------------------------------------------
Turn: 19, Gliscor: 57 hp, Snorlax: 160 hp
Snorlax used Fire Punch and dealt 18 hp of damage.
---------------------------------------------------
Turn: 20, Gliscor: 39 hp, Snorlax: 160 hp
Monte Carlo: Best move for Gliscor here is Roost, with win rate of 56.24335247819613%
Gliscor used Roost and healed 36 hp.
Snorlax lost 20 hp from poison.
Snorlax healed 10 hp from leftovers.
---------------------------------------------------
Turn: 21, Gliscor: 75 hp, Snorlax: 150 hp
Snorlax used Crunch and dealt 19 hp of damage.
---------------------------------------------------
Turn: 22, Gliscor: 56 hp, Snorlax: 150 hp
Monte Carlo: Best move for Gliscor here is Protect, with win rate of 62.80400572246065%
Gliscor used Protect.
Snorlax lost 30 hp from poison.
Snorlax healed 10 hp from leftovers.
---------------------------------------------------
Turn: 23, Gliscor: 56 hp, Snorlax: 130 hp
Snorlax used Fire Punch but Gliscor protected itself.
---------------------------------------------------
Turn: 24, Gliscor: 56 hp, Snorlax: 130 hp
Monte Carlo: Best move for Gliscor here is Protect, with win rate of 71.79306704205524%
Gliscor used Protect.
Snorlax lost 40 hp from poison.
Snorlax healed 10 hp from leftovers.
---------------------------------------------------
Turn: 25, Gliscor: 56 hp, Snorlax: 100 hp
Snorlax used Body Slam but Gliscor protected itself.
---------------------------------------------------
Turn: 26, Gliscor: 56 hp, Snorlax: 100 hp
Monte Carlo: Best move for Gliscor here is Protect, with win rate of 84.27793788024336%
Gliscor used Protect.
Snorlax lost 50 hp from poison.
Snorlax healed 10 hp from leftovers.
---------------------------------------------------
Turn: 27, Gliscor: 56 hp, Snorlax: 60 hp
Snorlax used Body Slam but Gliscor protected itself.
---------------------------------------------------
Turn: 28, Gliscor: 56 hp, Snorlax: 60 hp
Monte Carlo: Best move for Gliscor here is Earthquake, with win rate of 100%
Gliscor used Earthquake and dealt 12 hp of damage.
Snorlax lost 48 hp from poison.
---------------------------------
Outcome: Gliscor won with 56 hp remaining!
✨  Done in 7.23s.
```

The above output is extremely cool because we can already see Gliscor using the optimal strategy described previously. It prioritizes inflicting poison on Snorlax, and proceeds to stall and heal while occasionally inflicting direct damage with Earthquake when it can. I added a log to each turn that also shows the win-rate of the move selected, and we can see that the correct rows are being chosen.

For us to really understand how effective the new strategy is, we can run a ton of simulations with the new strategy and get the overall statistics:

```bash
yarn cli sim-monte-carlo-battles 125000

# output
...bash
---------------------------------
125000 total battles.
Gliscor won 122079 times (97.66319999999999% win rate).
Snorlax won 1125 times (0.8999999999999999% win rate).
Ended in a draw 1796 times (1.4368% draw rate).
---------------------------------
✨  Done in 4.89s.
```

Note that the command above takes much longer than the random strategy because of all of the reads from the Postgres database for the optimal moves. While an in-memory table would have made this faster, keeping the table in a separate database is a lot more memory efficient and scalable if multiple Pokemon are added in the future. The stats can be viewed again by running:

```bash
yarn cli view-monte-carlo-battle-stats
```

More importantly, we see that Gliscor's win rate with the Monte Carlo strategy is around `97.66%`! This is way better than the previous `42.397%` it was getting with the random strategy. Thus, we can conclude that our Monte Carlo table design works quite well.

## Looking at the Monte Carlo Table

The Monte Carlo table itself seems to show that the optimal Gliscor strategy (inflicting poison ASAP and stalling) seems to result in a higher win-rate.

```bash
id situation PokemonName Move Occurrences Wins CreatedAt UpdatedAt
72a295b4-df5f-444f-8715-ed56feb2c75b	75:160:undefined:undefined	Gliscor	Toxic	223974	113633	2022-05-05 06:54:49.904243	2022-05-05 20:27:59.128406
```

Note that for the starting situation, the highest win-rate is associated with the move toxic (early poison infliction). In addition, Roost seems to be the preferred move for situations where Gliscor has low HP, as it is a healing move.

## Conclusions

Overall, it seems that the Monte Carlo decision table strategy works very well for this matchup in Gliscor's favor. In the future, it would also be interesting to construct a table for Snorlax as well, and have both Pokemon use their Monte Carlo strategies in the same battle.

It is worth noting that my simulation of Pokemon, while still complex, is not nearly as complex as the actual game. The actual game has even more statistical factors like critical hits, accuracy, and other damage multipliers like types and such. Implementing these extra factors could be accomplished through future updates to the project.

## Using the Data I Worked With

As mentioned in the writeup, many of the steps I ran for this project take a really long time. I had a few simulations take so long I needed to run them overnight. If you want to experiment with the project or are grading this, you probably don't want to spend all that time constructing the Monte Carlo table or simulating games yourself.

I have stored a Postgres SQL dump of my data in `src/data/pokemon-dump.sql`. You can use a DB visualizer (e.g TablePlus, DataGrip, etc.) or the postgres CLI to import this dump into your database so you have all of the data I generated. Have fun!
