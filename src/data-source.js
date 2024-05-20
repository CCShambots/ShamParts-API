"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const Part_1 = require("./entity/Part");
const Project_1 = require("./entity/Project");
const User_1 = require("./entity/User");
const Compound_1 = require("./entity/Compound");
const LogEntry_1 = require("./entity/LogEntry");
const PartCombine_1 = require("./entity/PartCombine");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "5907",
    database: "postgres",
    synchronize: true,
    logging: false,
    entities: [Part_1.Part, Project_1.Project, User_1.User, Compound_1.Compound, LogEntry_1.LogEntry, PartCombine_1.PartCombine],
    subscribers: [],
    migrations: [],
});
//# sourceMappingURL=data-source.js.map