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

## Simulation Implementation
I wrote the simulation using TypeScript since I've been using Python the entire course and thought this would be a refreshing language to work with. 

## Running the Simulation
To run the simulated games, you will first need to install the necessary npm packages required to run the simulation command. From there, you need to make sure the Docker container is running on your machine. This is necessary in order to have Postgres running:

```bash
# install packages
yarn

# run the docker container (keep this running)
docker-compose up
```

Once the above steps are complete, you can run the simulation using the following command:

```bash
yarn cli simulate [number of battles to simulate (default 100)]

# example call with default battles
yarn cli simulate

# example call with 10,000 battles
yarn cli simulate 10000
```


