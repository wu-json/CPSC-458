import { Command } from "commander";
import cliProgress from "cli-progress";

import { battle } from "../battle/battle";
import { Item } from "../pokemon/types";
import { Gliscor } from "../pokemon/Gliscor";
import { Snorlax } from "../pokemon/Snorlax";

const simulateVerboseRandomBattle = new Command()
  .command("sim-verbose-random-battle")
  .description("Simulate a verbose random battle")
  .action(async () => {
    try {
      const gliscor = new Gliscor();
      const snorlax = new Snorlax(Item.Leftovers);

      await battle(gliscor, snorlax, { verbose: true });

      process.exit(0);
    } catch (error) {
      console.error(`Something went wrong: ${error}`);
      process.exit(1);
    }
  });

export default simulateVerboseRandomBattle;
