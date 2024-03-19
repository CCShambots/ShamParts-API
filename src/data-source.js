"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const Part_1 = require("./entity/Part");
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
    entities: [Part_1.Part, Project_1.Project],
    subscribers: [],
    migrations: [],
});
//# sourceMappingURL=data-source.js.map