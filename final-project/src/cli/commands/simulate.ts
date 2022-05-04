import { Command } from "commander";

import { battle } from "../battle/battle";
import dataSource from "../connections/typeorm";
import { Item } from "../pokemon/types";
import { Gliscor } from "../pokemon/Gliscor";
import { Snorlax } from "../pokemon/Snorlax";

const simulate = new Command()
  .command("simulate")
  .description("Simulate battles")
  .argument("[battles]", "How many simulated battles to run")
  .action(async (battles: string) => {
    try {
      /**
       * Connect to Postgres
       */
      console.log("---------------------------------");
      console.log("Initializing data source...");

      await dataSource.initialize();

      console.log("Data source initialized.");
      console.log("---------------------------------");

      const battlesToSimulate = battles ? parseInt(battles) : 100;
      console.log(`Simulating ${battlesToSimulate} battles.`);

      const gliscor = new Gliscor(Item.ToxicOrb);
      const snorlax = new Snorlax(Item.Leftovers);

      const result = await battle(gliscor, snorlax);

      console.log("RESULT:::");
      console.log(result);

      process.exit(0);
    } catch (error) {
      console.error(`Something went wrong: ${error}`);
      process.exit(1);
    }
  });

export default simulate;
