import { Command } from "commander";
import generateMonteCarloRows from "./commands/generateMonteCarloRows";
import simulateRandomBattles from "./commands/simulateRandomBattles";
import viewRandomBattleStats from "./commands/viewRandomBattleStats";

const program = new Command();

program
  .name("final-project-cli")
  .description("CLI for final project in CPSC 458")
  .addCommand(generateMonteCarloRows)
  .addCommand(simulateRandomBattles)
  .addCommand(viewRandomBattleStats);

program.parse();
