"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const part_controller_1 = require("../controllers/part.controller");
const router = express_1.default.Router();
router.get('/:id', part_controller_1.getPart);
router.get('/:id/loadImage', part_controller_1.loadPartThumbnail);
router.get('/:id/break', part_controller_1.reportBreakage);
router.get('/:id/request', part_controller_1.requestAdditional);
router.get('/:id/fulfill', part_controller_1.fulfillRequest);
router.patch('/:id/assign', part_controller_1.assignUser);
router.delete('/:id/unAssign', part_controller_1.unAssignUser);
router.patch("/:id/setDimensions", part_controller_1.setDimensions);
exports.default = router;
//# sourceMappingURL=part.js.map