"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const Post_1 = require("./entity/Post");
const Category_1 = require("./entity/Category");
const Part_1 = require("./entity/Part");
const config_json_1 = __importDefault(require("../config.json"));
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: "localhost",
    port: config_json_1.default.port,
    username: config_json_1.default.username,
    password: config_json_1.default.password,
    database: config_json_1.default.database,
    synchronize: true,
    logging: true,
    entities: [Post_1.Post, Category_1.Category, Part_1.Part],
    subscribers: [],
    migrations: [],
});
//# sourceMappingURL=data-source.js.map