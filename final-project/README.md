# Pokemon Monte Carlo Simulation

## Background

Welcome to my final project for Automated Decision Systems at Yale! For this project, I've decided to apply Monte Carlo simulation on Pokemon, a turn-based battle game in which two Pokemon fight until one is knocked out. A Pokemon is knocked out when their HP reaches 0. I grew up playing this game, and thought it might be an interesting application of Monte Carlo simulation since it is surprisingly complex. There are even many competitive ESports tournaments oriented around the game at a very high level of competitive play. Many moves have consequences that can last throughout the duration of the battle, so I thought it would be interesting to see how well simulations could capture the optimal strategies for these cute little monsters.

## Simulation

This project simulates a battle between a Pokemon called Gliscor (left) and Snorlax (right). For the sake of the project, these are the only Pokemon available for the simulation, though the code is written in a way where adding other Pokemon would be pretty easy in the future.

<div style="display:flex; padding: 30px;">
<img width="120" alt="Gliscor" src="https://static.wikia.nocookie.net/vsbattles/images/5/5b/472.png/revision/latest?cb=20160521201947">
<img width="140" alt="Snorlax" src="https://images.gameinfo.io/pokemon/256/p143f157.webp">
</div>

I chose Gliscor as the basis for the simulation since there is an optimal strategy with Gliscor. The optimal strategy is to inflict poison on the enemy as soon as possible, and then last as long as possible by spamming heals when necessary and attacking otherwise. I chose Snorlax as the opposing Pokemon since it is known for being a strong defensive pick, therefore making sure that the battles will last enough time for the Gliscor poison strategy to actually matter.

## Tools, Frameworks, Languages

I wrote the simulation as a Node.js CLI (using [commander](https://www.npmjs.com/package/commander)) in Typescript. Writing a CLI for this project made it super easy to run more simulations and view overall outcome statistics on the terminal. I chose to write the simulation using TypeScript since I've been using Python the entire course and thought this would be a refreshing language to work with.

I'm also very familiar with database libraries in TypeScript (particularly [TypeORM](https://www.npmjs.com/package/typeorm)). This was super useful since this project uses Postgres to store most large datasets including outcomes of simulations and the generated Monte Carlo. I chose to use a robust database for this instead of storing these results in-memory because the state tree for Pokemon can be a lot larger than BlackJack, so the chances are I would need to run and persist more simulation outcomes quite frequently. Having these in a database allows me to expand existing datasets without having to rerun N simulations at once.

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

To run real commands on the CLI, you will need to run the following commands first to install packages and set up a local Postgres instance:

```bash
# install packages
yarn

# start local postgres (you need docker-compose install for this)
docker-compose up
```

If you do not have docker-compose installed you can download it [here](https://docs.docker.com/compose/).
