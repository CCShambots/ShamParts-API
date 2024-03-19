"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const test_1 = __importDefault(require("./test"));
const onshape_1 = __importDefault(require("./onshape"));
const project_1 = __importDefault(require("./project"));
const part_1 = __importDefault(require("./part"));
const router = express_1.default.Router();
router.use('/test', test_1.default);
router.use('/onshape', onshape_1.default);
router.use('/project', project_1.default);
router.use('/part', part_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map