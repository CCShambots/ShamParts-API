"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const data_source_1 = require("./data-source");
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const index_1 = __importDefault(require("./routes/index"));
const http = __importStar(require("http"));
require("reflect-metadata");
const config_json_1 = __importDefault(require("../config.json"));
const Server_1 = require("./entity/Server");
const server_controller_1 = require("./controllers/server.controller");
const fs_1 = require("fs"); // Use the promises API from fs module
data_source_1.AppDataSource.initialize()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const router = (0, express_1.default)();
    if (config_json_1.default.ip_address === config_json_1.default.leader_ip) {
        //This is the leader repo, so create the database entry
        console.log("Detected this as leader server... instantiating self in database");
        //If this server already exists, just make sure it's name and IP are correct
        let server = yield data_source_1.AppDataSource.manager.findOne(Server_1.Server, { where: { ip: config_json_1.default.ip_address } });
        let servers = yield data_source_1.AppDataSource.manager.find(Server_1.Server);
        if (!server) {
            server = new Server_1.Server();
            server.random_token = (0, server_controller_1.generateSafeRandomToken)(servers.map(e => e.random_token));
            server.key = (0, server_controller_1.generateSafeKey)(servers.map(e => e.key));
        }
        server.name = config_json_1.default.name;
        server.ip = config_json_1.default.ip_address;
        server.verified = true;
        config_json_1.default.server_key = server.key;
        config_json_1.default.server_token = server.random_token;
        // Save the modified configJson back to the config.json file
        yield fs_1.promises.writeFile('../config.json', JSON.stringify(config_json_1.default, null, 2));
        yield data_source_1.AppDataSource.manager.save(server);
        console.log("successfully added self to database");
    }
    else {
        //Register with the host
        console.log(`Attempting to register with master server at: ${config_json_1.default.leader_ip}`);
        let response = yield fetch(`${config_json_1.default.leader_ip}/server/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: config_json_1.default.name,
                ip: config_json_1.default.ip_address
            }),
            signal: AbortSignal.timeout(5000)
        });
        if (response.status !== 200) {
            console.log(`Error registering with host: ${response.status} - ${response.statusText}`);
            process.exit(-1);
        }
        else {
            // Modify configJson here if needed
            let returned = yield response.json();
            config_json_1.default.server_key = returned.key;
            config_json_1.default.server_token = returned.random_token;
            console.log("attempting to save configJson: ", config_json_1.default);
            console.log(process.cwd());
            // Save the modified configJson back to the config.json file
            yield fs_1.promises.writeFile('config.json', JSON.stringify(config_json_1.default, null, 2));
        }
    }
    router.use((0, morgan_1.default)("dev"));
    router.use(express_1.default.urlencoded({ extended: false }));
    router.use(express_1.default.json({ limit: "50mb" }));
    router.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "origin, X-Requested-With, Content-Type, Accept");
        if (req.method === "OPTIONS") {
            res.header("Access-Control-Allow-Methods", "GET PATCH POST PUT DELETE");
            return res.status(200).json({});
        }
        next();
    });
    router.use("/", index_1.default);
    router.use((req, res, next) => {
        const error = new Error("Not found");
        return res.status(404).json({
            message: error.message
        });
    });
    const httpServer = http.createServer(router);
    const PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3000;
    httpServer.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}))
    .catch((error) => console.log("Error: ", error));
//# sourceMappingURL=index.js.map