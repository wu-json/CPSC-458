import { Command } from "commander";
import cliProgress from "cli-progress";

import { battle } from "../battle/battle";
import dataSource from "../connections/typeorm";
import { Item } from "../pokemon/types";
import { Gliscor } from "../pokemon/Gliscor";
import { Snorlax } from "../pokemon/Snorlax";
import { MonteCarloStrategyOutcome } from "../entity/MonteCarloStrategyOutcome";

const simulateMonteCarloBattles = new Command()
  .command("sim-monte-carlo-battles")
  .description(
    "Simulate monte carlo strategy battles and save their results into Postgres"
  )
  .argument("[battles]", "How many simulated battles to run")
  .action(async (battles: string) => {
    try {
      /**
       * Connect to Postgres.
       */
      console.log("---------------------------------");
      console.log("Initializing data source...");
      await dataSource.initialize();
      console.log("Data source initialized.");
      console.log("---------------------------------");

      /**
       * Simulate battles and track/save results.
       */
      const battlesToSimulate = battles ? parseInt(battles) : 100;
      console.log(`Simulating ${battlesToSimulate} battles.`);

      let battlesSimulated = 0;
      let gliscorWins = 0;
      let snorlaxWins = 0;
      let draws = 0;

      const progressBar = new cliProgress.SingleBar(
        {},
        cliProgress.Presets.shades_classic
      );

      progressBar.start(battlesToSimulate, 0);

      while (battlesSimulated < battlesToSimulate) {
        /**
         * Gliscor is too strong with the toxic orb so we don't give it to him.
         * We give Snorlax leftovers as a handicap.
         */
        const gliscor = new Gliscor();
        const snorlax = new Snorlax(Item.Leftovers);

        const result = await battle(gliscor, snorlax, {
          useMonteCarloStrategy: true,
        });

        if (result.outcome === "draw") {
          draws++;
        } else if (result.outcome === "winner") {
          if (result.winner?.name === "Gliscor") {
            gliscorWins++;
          } else {
            snorlaxWins++;
          }
        }

        await MonteCarloStrategyOutcome.create({
          pokemon1Name: gliscor.name,
          pokemon2Name: snorlax.name,
          pokemon2Item: Item.Leftovers,
          outcome: result.outcome,
          winner: result.winner?.name,
        }).save();

        battlesSimulated++;
        progressBar.update(battlesSimulated);
      }
      progressBar.stop();

      /**
       * Print results.
       */
      console.log("---------------------------------");
      console.log(`Simulated ${battlesSimulated} total battles.`);
      console.log(
        `Gliscor won ${gliscorWins} times (${
          (gliscorWins / battlesSimulated) * 100
        }% win rate).`
      );
      console.log(
        `Snorlax won ${snorlaxWins} times (${
          (snorlaxWins / battlesSimulated) * 100
        }% win rate).`
      );
      console.log(
        `Ended in a draw ${draws} times (${
          (draws / battlesSimulated) * 100
        }% draw rate).`
      );
      console.log("---------------------------------");

      process.exit(0);
    } catch (error) {
      console.error(`Something went wrong: ${error}`);
      process.exit(1);
    }
  });

export default simulateMonteCarloBattles;
