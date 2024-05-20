import "reflect-metadata"
import { DataSource } from "typeorm"
import {Part} from "./entity/Part";
import {Project} from "./entity/Project";
import {User} from "./entity/User";
import {Compound} from "./entity/Compound";
import {LogEntry} from "./entity/LogEntry";
import {PartCombine} from "./entity/PartCombine";

export const AppDataSource = new DataSource({

  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "5907",
  database: "postgres",
  synchronize: true,
  logging: false,
  entities: [Part, Project, User, Compound, LogEntry, PartCombine],
  subscribers: [],
  migrations: [],
})
