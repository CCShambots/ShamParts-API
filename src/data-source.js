"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const Post_1 = require("./entity/Post");
const Category_1 = require("./entity/Category");
const Part_1 = require("./entity/Part");
const Assembly_1 = require("./entity/Assembly");
const Project_1 = require("./entity/Project");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "5907",
    database: "postgres",
    synchronize: true,
    logging: false,
    entities: [Post_1.Post, Category_1.Category, Part_1.Part, Assembly_1.Assembly, Project_1.Project],
    subscribers: [],
    migrations: [],
});
//# sourceMappingURL=data-source.js.map