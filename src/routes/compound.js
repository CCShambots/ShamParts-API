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
router.patch("/:id/updateCamInstructions", compound_controller_1.updateCamInstructions);
router.patch("/:id/camDone", compound_controller_1.camDone);
router.post("/:id/fulfill", compound_controller_1.fulfillCompound);
router.patch("/:id/decrementPart", compound_controller_1.decrementPart);
router.patch("/:id/incrementPart", compound_controller_1.incrementPart);
router.delete("/:id/delete", compound_controller_1.deleteCompound);
router.patch("/:id/update", compound_controller_1.updateCompound);
exports.default = router;
//# sourceMappingURL=compound.js.map