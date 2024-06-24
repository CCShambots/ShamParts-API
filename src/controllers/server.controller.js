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
exports.deleteServer = exports.denyServer = exports.verifyServer = exports.addFollowerServer = exports.checkForValidServer = exports.getServer = exports.getServersFromKeys = exports.getServers = exports.generateSafeKey = exports.generateSafeRandomToken = void 0;
const Server_1 = require("../entity/Server");
const data_source_1 = require("../data-source");
const class_transformer_1 = require("class-transformer");
const User_1 = require("../entity/User");
const Mailjet_1 = require("../util/Mailjet");
const config_json_1 = __importDefault(require("../../config.json"));
function generateSafeRandomToken(disallowedStrings) {
    let val = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    while (disallowedStrings.includes(val)) {
        val = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
    return val;
}
exports.generateSafeRandomToken = generateSafeRandomToken;
function generateSafeKey(disallowedKeys) {
    let key = generateAlphanumericKey();
    while (disallowedKeys.includes(key)) {
        key = generateAlphanumericKey();
    }
    return key;
}
exports.generateSafeKey = generateSafeKey;
function generateAlphanumericKey() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let key = '';
    for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        key += characters[randomIndex];
    }
    return key;
}
const getServers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.User.getUserFromRandomToken(req.headers.token);
    if (!user) {
        return res.status(404).send("User not found");
    }
    else if (!user.isAdmin()) {
        return res.status(403).send("You must be an admin to do this");
    }
    let servers = yield data_source_1.AppDataSource.manager.find(Server_1.Server);
    servers = servers.filter(e => e.verified);
    const plainServers = servers.map(e => (0, class_transformer_1.instanceToPlain)(e));
    return res.status(200).send(plainServers);
});
exports.getServers = getServers;
const getServersFromKeys = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let keys = req.query.keys;
    let servers = yield data_source_1.AppDataSource.manager
        .createQueryBuilder(Server_1.Server, "server").getMany();
    servers.filter(e => keys.includes(e.key));
    return res.status(200).send(servers.map(e => (0, class_transformer_1.instanceToPlain)(e)));
});
exports.getServersFromKeys = getServersFromKeys;
const getServer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const server = yield data_source_1.AppDataSource.manager.findOne(Server_1.Server, { where: { key: req.params.key } });
    if (!server) {
        return res.status(404).send("Server not found");
    }
    return res.status(200).send((0, class_transformer_1.instanceToPlain)(server));
});
exports.getServer = getServer;
const checkForValidServer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const server = yield data_source_1.AppDataSource.manager.findOne(Server_1.Server, { where: { key: req.body.key } });
    if (!server) {
        return res.status(404).send("Server not found");
    }
    return res.status(200).send(server.verified);
});
exports.checkForValidServer = checkForValidServer;
const addFollowerServer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //Check to see if this server already exists
    const existing = yield data_source_1.AppDataSource.manager.findOne(Server_1.Server, { where: { ip: req.body.ip } });
    if (existing && req.body.ip.indexOf("localhost") === -1) {
        return res.status(403).send("Server already exists");
    }
    let servers = yield data_source_1.AppDataSource.manager.find(Server_1.Server);
    if (servers.filter(e => e.name === req.body.name).length > 0) {
        return res.status(403).send("Server name already exists");
    }
    const server = new Server_1.Server();
    server.name = req.body.name;
    server.ip = req.body.ip;
    server.verified = false;
    server.key = generateSafeKey(servers.map(e => e.key));
    server.random_token = generateSafeRandomToken(servers.map(e => e.random_token));
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