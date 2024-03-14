import "reflect-metadata"
import { DataSource } from "typeorm"
import { Post } from "./entity/Post"
import { Category } from "./entity/Category"
import {Part} from "./entity/Part";

export const AppDataSource = new DataSource({

  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "5907",
  database: "postgres",
  synchronize: true,
  logging: true,
  entities: [Post, Category, Part],
  subscribers: [],
  migrations: [],
})
