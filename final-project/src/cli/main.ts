import { Command } from "commander";
import generateMonteCarloRows from "./commands/generateMonteCarloRows";
import simulateMonteCarloBattles from "./commands/simulateMonteCarloBattles";
import simulateRandomBattles from "./commands/simulateRandomBattles";
import viewMonteCarloBattleStats from "./commands/viewMonteCarloBattleStats";
import viewRandomBattleStats from "./commands/viewRandomBattleStats";

const program = new Command();

program
  .name("final-project-cli")
  .description("CLI for final project in CPSC 458")
  .addCommand(generateMonteCarloRows)
  .addCommand(simulateMonteCarloBattles)
  .addCommand(simulateRandomBattles)
  .addCommand(viewMonteCarloBattleStats)
  .addCommand(viewRandomBattleStats);

program.parse();
