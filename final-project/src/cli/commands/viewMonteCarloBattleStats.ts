import { Command } from "commander";
import dataSource from "../connections/typeorm";
import { MonteCarloStrategyOutcome } from "../entity/MonteCarloStrategyOutcome";

const viewMonteCarloBattleStats = new Command()
  .command("view-monte-carlo-battle-stats")
  .description("See an overview of the win rates of Gliscor vs. Snorlax")
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

      /**
       * Query data.
       */
      console.log("Querying data...");
      const [totalRows, totalDraws, totalGliscorWins, totalSnorlaxWins] =
        await Promise.all([
          MonteCarloStrategyOutcome.createQueryBuilder("rso").getCount(),
          MonteCarloStrategyOutcome.createQueryBuilder("rso")
            .where("rso.outcome = 'draw'")
            .getCount(),
          MonteCarloStrategyOutcome.createQueryBuilder("rso")
            .where("rso.winner = 'Gliscor'")
            .getCount(),
          MonteCarloStrategyOutcome.createQueryBuilder("rso")
            .where("rso.winner = 'Snorlax'")
            .getCount(),
        ]);

      /**
       * Print query results.
       */
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

export default viewMonteCarloBattleStats;
