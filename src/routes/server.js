"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const server_controller_1 = require("../controllers/server.controller");
const router = express_1.default.Router();
router.get("/list", server_controller_1.getServers);
router.post("/add", server_controller_1.addFollowerServer);
exports.default = router;
//# sourceMappingURL=server.js.map