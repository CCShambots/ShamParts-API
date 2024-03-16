import "reflect-metadata"
import { DataSource } from "typeorm"
import { Post } from "./entity/Post"
import { Category } from "./entity/Category"
import {Part} from "./entity/Part";
import {Assembly} from "./entity/Assembly";
import {Project} from "./entity/Project";

export const AppDataSource = new DataSource({

  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "5907",
  database: "postgres",
  synchronize: true,
  logging: true,
  entities: [Post, Category, Part, Assembly, Project],
  subscribers: [],
  migrations: [],
})
