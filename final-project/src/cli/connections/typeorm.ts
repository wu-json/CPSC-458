import { DataSource } from "typeorm";
import { MonteCarlo } from "../entity/MonteCarlo";
import { RandomStrategyOutcomes } from "../entity/RandomStrategyOutcomes";

const dataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "user",
  password: "pass",
  database: "pokemon",
  entities: [MonteCarlo, RandomStrategyOutcomes],
  synchronize: true,
});

export default dataSource;
