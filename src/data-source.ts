import "reflect-metadata"
import { DataSource } from "typeorm"
import { Post } from "./entity/Post"
import { Category } from "./entity/Category"
import {Part} from "./entity/Part";
import config from "../config.json";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: config.port,
  username: config.username,
  password: config.password,
  database: config.database,
  synchronize: true,
  logging: true,
  entities: [Post, Category, Part],
  subscribers: [],
  migrations: [],
})
