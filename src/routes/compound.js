"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const compound_controller_1 = require("../controllers/compound.controller");
const router = express_1.default.Router();
router.post("/create", compound_controller_1.createCompound);
router.patch('/:id/assign', compound_controller_1.assignUser);
router.delete('/:id/unAssign', compound_controller_1.unAssignUser);
router.post("/:id/uploadImage", compound_controller_1.uploadImage);
exports.default = router;
//# sourceMappingURL=compound.js.map