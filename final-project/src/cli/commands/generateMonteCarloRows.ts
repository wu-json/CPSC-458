import { Command } from "commander";
import cliProgress from "cli-progress";

import dataSource from "../connections/typeorm";

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
      process.exit(0);
    } catch (error) {
      console.error(`Something went wrong: ${error}`);
      process.exit(1);
    }
  });

export default generateMonteCarloRows;
