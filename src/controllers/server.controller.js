"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addFollowerServer = exports.getServers = void 0;
const Server_1 = require("../entity/Server");
const data_source_1 = require("../data-source");
const getServers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const servers = yield data_source_1.AppDataSource.manager.find(Server_1.Server);
    return res.status(200).send(servers);
});
exports.getServers = getServers;
const addFollowerServer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //Check to see if this server already exists
    const existing = yield data_source_1.AppDataSource.manager.findOne(Server_1.Server, { where: { ip: req.body.ip } });
    if (existing) {
        return res.status(200).send("Server already exists");
    }
    const server = new Server_1.Server();
    server.name = req.body.name;
    server.ip = req.body.ip;
    yield data_source_1.AppDataSource.manager.save(server);
    return res.status(200).send(server);
});
exports.addFollowerServer = addFollowerServer;
//# sourceMappingURL=server.controller.js.map