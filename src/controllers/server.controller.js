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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteServer = exports.denyServer = exports.verifyServer = exports.addFollowerServer = exports.getServers = void 0;
const Server_1 = require("../entity/Server");
const data_source_1 = require("../data-source");
const class_transformer_1 = require("class-transformer");
const User_1 = require("../entity/User");
const Mailjet_1 = require("../util/Mailjet");
const config_json_1 = __importDefault(require("../../config.json"));
const user_controller_1 = require("./user.controller");
const getServers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let servers = yield data_source_1.AppDataSource.manager.find(Server_1.Server);
    servers = servers.filter(e => e.verified);
    const plainServers = servers.map(e => (0, class_transformer_1.instanceToPlain)(e));
    return res.status(200).send(plainServers);
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
    server.verified = false;
    server.random_token = (0, user_controller_1.generateRandomToken)();
    yield data_source_1.AppDataSource.manager.save(server);
    //Send verificaiton email
    yield (0, Mailjet_1.sendServerVerification)(config_json_1.default.admin_user, server.name, server.random_token);
    return res.status(200).send(server);
});
exports.addFollowerServer = addFollowerServer;
const verifyServer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const server = yield data_source_1.AppDataSource.manager.findOne(Server_1.Server, { where: { random_token: req.body.token } });
    if (!server) {
        return res.status(404).send("Server not found");
    }
    server.verified = true;
    yield data_source_1.AppDataSource.manager.save(server);
    return res.status(200).send(server);
});
exports.verifyServer = verifyServer;
const denyServer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const server = yield data_source_1.AppDataSource.manager.findOne(Server_1.Server, { where: { random_token: req.params.token } });
    if (!server) {
        return res.status(404).send("Server not found");
    }
    yield data_source_1.AppDataSource.manager.remove(server);
    return res.status(200).send(server);
});
exports.denyServer = denyServer;
const deleteServer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.User.getUserFromRandomToken(req.query.token);
    if (!user) {
        //Return an error message (could not find user to verify)
        return res.status(404).send("User not found");
    }
    if (!user.roles.includes('admin')) {
        return res.status(403).send("You must be an admin to do this");
    }
    const server = yield data_source_1.AppDataSource.manager.findOne(Server_1.Server, { where: { ip: req.params.ip } });
    if (!server) {
        return res.status(404).send("Server not found");
    }
    yield data_source_1.AppDataSource.manager.remove(server);
    return res.status(200).send(server);
});
exports.deleteServer = deleteServer;
//# sourceMappingURL=server.controller.js.map