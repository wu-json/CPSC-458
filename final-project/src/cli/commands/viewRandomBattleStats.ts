import { Command } from "commander";
import dataSource from "../connections/typeorm";
import { RandomStrategyOutcome } from "../entity/RandomStrategyOutcome";

const viewRandomBattleStats = new Command()
  .command("view-random-battle-stats")
  .description("See an overview of the win rates of Gliscor vs. Snorlax")
  .action(async () => {
    try {
      /**
       * Connect to Postgres
       */
      console.log("---------------------------------");
      console.log("Initializing data source...");

      await dataSource.initialize();

      console.log("Data source initialized.");
      console.log("---------------------------------");

      console.log("Querying data...");

      const [totalRows, totalDraws, totalGliscorWins, totalSnorlaxWins] =
        await Promise.all([
          RandomStrategyOutcome.createQueryBuilder("rso").getCount(),
          RandomStrategyOutcome.createQueryBuilder("rso")
            .where("rso.outcome = 'draw'")
            .getCount(),
          RandomStrategyOutcome.createQueryBuilder("rso")
            .where("rso.winner = 'Gliscor'")
            .getCount(),
          RandomStrategyOutcome.createQueryBuilder("rso")
            .where("rso.winner = 'Snorlax'")
            .getCount(),
        ]);

      console.log("---------------------------------");
      console.log(`${totalRows} total battles.`);
      console.log(
        `Gliscor won ${totalGliscorWins} times (${
          (totalGliscorWins / totalRows) * 100
        }% win rate).`
      );
      console.log(
        `Snorlax won ${totalSnorlaxWins} times (${
          (totalSnorlaxWins / totalRows) * 100
        }% win rate).`
      );
      console.log(
        `Ended in a draw ${totalDraws} times (${
          (totalDraws / totalRows) * 100
        }% draw rate).`
      );
      console.log("---------------------------------");

      process.exit(0);
    } catch (error) {
      console.error(`Something went wrong: ${error}`);
      process.exit(1);
    }
  });

export default viewRandomBattleStats;
