import { DataSource } from "typeorm";
import { Move } from "../entity/Move";

const dataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "user",
  password: "pass",
  database: "pokemon-simulation",
  entities: [Move],
  synchronize: true,
});

export default dataSource;
