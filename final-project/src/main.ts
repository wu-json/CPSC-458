import { Command } from "commander";
import simulate from "./commands/simulate";

const program = new Command();

program
  .name("final-project-cli")
  .description("CLI for final project in CPSC 458")
  .addCommand(simulate);

program.parse();
