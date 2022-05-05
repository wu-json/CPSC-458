import { DataSource } from "typeorm";
import { MonteCarlo } from "../entity/MonteCarlo";

const dataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "user",
  password: "pass",
  database: "pokemon",
  entities: [MonteCarlo],
  synchronize: true,
});

export default dataSource;
