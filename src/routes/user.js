"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const router = express_1.default.Router();
router.post("/create", user_controller_1.createUser);
router.get("/verify", user_controller_1.verifyUser);
router.get("/cancel", user_controller_1.cancelUser);
router.get("/users", user_controller_1.getUsers);
exports.default = router;
//# sourceMappingURL=user.js.map