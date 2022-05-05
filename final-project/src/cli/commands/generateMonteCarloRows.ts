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

        const gliscorWon =
          result.outcome === "winner" && result.winner?.name === "Gliscor";

        await bluebird.mapSeries(gliscorTrackedMoves, async (m) => {
          const monteCarloRow = await MonteCarlo.findOne({
            where: {
              situation: m.situation,
              move: m.moveName,
              pokemonName: "Gliscor",
            },
          });

          if (!monteCarloRow) {
            await MonteCarlo.create({
              situation: m.situation,
              pokemonName: gliscor.name,
              move: m.moveName,
              occurrences: 1,
              wins: gliscorWon ? 1 : 0,
            }).save();
          } else {
            monteCarloRow.occurrences++;
            if (gliscorWon) {
              monteCarloRow.wins++;
            }
            await monteCarloRow.save();
          }
        });

        battlesSimulated++;
        progressBar.update(battlesSimulated);
      }
      progressBar.stop();

      /**
       * Results
       */
      console.log("---------------------------------");
      console.log("Finished adding rows to Monte Carlo table.");
      console.log("---------------------------------");

      process.exit(0);
    } catch (error) {
      console.error(`Something went wrong: ${error}`);
      process.exit(1);
    }
  });

export default generateMonteCarloRows;
