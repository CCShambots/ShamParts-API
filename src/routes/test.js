"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const test_controller_1 = require("../controllers/test.controller");
const router = express_1.default.Router();
router.get('/testRoute', test_controller_1.testFunction);
exports.default = router;
//# sourceMappingURL=test.js.map