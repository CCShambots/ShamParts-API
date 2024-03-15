"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const onshape_controller_1 = require("../controllers/onshape.controller");
const router = express_1.default.Router();
router.get('/documents', onshape_controller_1.getDocuments);
router.get('/assemblies', onshape_controller_1.getAssemblies);
exports.default = router;
//# sourceMappingURL=onshape.js.map