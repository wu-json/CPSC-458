import bluebird from "bluebird";
import { Command } from "commander";
import cliProgress from "cli-progress";
import { In } from "typeorm";
import { keyBy } from "lodash/fp";

import { battle } from "../battle/battle";
import dataSource from "../connections/typeorm";
import { Item } from "../pokemon/types";
import { MonteCarlo } from "../entity/MonteCarlo";
import { Gliscor } from "../pokemon/Gliscor";
import { Snorlax } from "../pokemon/Snorlax";

const generateMonteCarloRows = new Command()
  .command("generate-monte-carlo-rows")
  .description(
    "Simulate random strategy battles and save them as Monte Carlo rows."
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

      const progressBar = new cliProgress.SingleBar(
        {},
        cliProgress.Presets.shades_classic
      );

      progressBar.start(battlesToSimulate, 0);

      let battlesSimulated = 0;

      while (battlesSimulated < battlesToSimulate) {
        /**
         * Gliscor is too strong with the toxic orb so we don't give it to him.
         * We give Snorlax leftovers as a handicap.
         */
        const gliscor = new Gliscor();
        const snorlax = new Snorlax(Item.Leftovers);

        const result = await battle(gliscor, snorlax);

        const { pokemon1TrackedMoves: gliscorTrackedMoves } = result;

        const monteCarloRows = await MonteCarlo.find({
          where: {
            situation: In(gliscorTrackedMoves.map((m) => m.situation)),
          },
        });
        const monteCarloMap = keyBy("situation", monteCarloRows);
        const gliscorWon =
          result.outcome === "winner" && result.winner?.name === "Gliscor";

        gliscorTrackedMoves.forEach((m) => {
          if (monteCarloMap[m.situation]) {
            monteCarloMap[m.situation].occurrences++;
            if (gliscorWon) {
              monteCarloMap[m.situation].wins++;
            }
          } else {
            monteCarloMap[m.situation] = MonteCarlo.create({
              situation: m.situation,
              pokemonName: gliscor.name,
              move: m.moveName,
              occurrences: 1,
              wins: gliscorWon ? 1 : 0,
            });
          }
        });

        // save updated monte carlo rows
        await MonteCarlo.save(Object.values(monteCarloMap));

        battlesSimulated++;
        progressBar.update(battlesSimulated);
      }
      progressBar.stop();

      process.exit(0);
    } catch (error) {
      console.error(`Something went wrong: ${error}`);
      process.exit(1);
    }
  });

export default generateMonteCarloRows;
