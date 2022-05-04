import { Command } from "commander";

const simulate = new Command()
  .command("simulate")
  .description("Simulate battles")
  .argument("[battles]", "How many simulated battles to run")
  .action(async (battles: string) => {
    try {
      const battlesToSimulate = battles ? parseInt(battles) : 100;
      console.log(`Simulating ${battlesToSimulate} battles.`);
    } catch (error) {
      console.error(`Something went wrong: ${error}`);
    }
  });

export default simulate;
