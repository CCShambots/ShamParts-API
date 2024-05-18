"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const project_controller_1 = require("../controllers/project.controller");
const router = express_1.default.Router();
router.post('/create', project_controller_1.createProject);
router.get('/list', project_controller_1.getProjects);
router.get('/:name', project_controller_1.getProject);
router.patch("/:name/addRole", project_controller_1.addRole);
router.patch("/:name/removeRole", project_controller_1.removeRole);
exports.default = router;
//# sourceMappingURL=project.js.map