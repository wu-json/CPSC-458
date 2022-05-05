import { DataSource } from "typeorm";
import { MonteCarlo } from "../entity/MonteCarlo";
import { RandomStrategyOutcome } from "../entity/RandomStrategyOutcome";

const dataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "user",
  password: "pass",
  database: "pokemon",
  entities: [MonteCarlo, RandomStrategyOutcome],
  synchronize: true,
});

export default dataSource;
