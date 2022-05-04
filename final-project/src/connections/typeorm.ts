import { DataSource } from "typeorm";
import { GliscorMove } from "../entity/GliscorMove";

const dataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "user",
  password: "pass",
  database: "gliscor-simulation",
  entities: [GliscorMove],
  synchronize: true,
});

export default dataSource;
