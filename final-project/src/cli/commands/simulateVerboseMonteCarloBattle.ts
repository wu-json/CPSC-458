import { Command } from "commander";

import { battle } from "../battle/battle";
import dataSource from "../connections/typeorm";
import { Item } from "../pokemon/types";
import { Gliscor } from "../pokemon/Gliscor";
import { Snorlax } from "../pokemon/Snorlax";

const simulateVerboseMonteCarloBattle = new Command()
  .command("sim-verbose-monte-carlo-battle")
  .description("Simulate a verbose monte carlo battle")
  .action(async () => {
    try {
      /**
       * Connect to Postgres.
       */
      console.log("---------------------------------");
      console.log("Initializing data source...");
      await dataSource.initialize();
      console.log("Data source initialized.");
      console.log("---------------------------------");

      const gliscor = new Gliscor();
      const snorlax = new Snorlax(Item.Leftovers);

      await battle(gliscor, snorlax, {
        verbose: true,
        useMonteCarloStrategy: true,
      });

      process.exit(0);
    } catch (error) {
      console.error(`Something went wrong: ${error}`);
      process.exit(1);
    }
  });

export default simulateVerboseMonteCarloBattle;
