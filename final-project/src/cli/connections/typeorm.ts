import { DataSource } from "typeorm";
import { MonteCarlo } from "../entity/MonteCarlo";
import { MonteCarloStrategyOutcome } from "../entity/MonteCarloStrategyOutcome";
import { RandomStrategyOutcome } from "../entity/RandomStrategyOutcome";

const dataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "user",
  password: "pass",
  database: "pokemon",
  entities: [MonteCarlo, MonteCarloStrategyOutcome, RandomStrategyOutcome],
  synchronize: true,
});

export default dataSource;
