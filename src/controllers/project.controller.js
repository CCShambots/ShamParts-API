"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProject = void 0;
const Project_1 = require("../entity/Project");
const createProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let project = new Project_1.Project();
    project.name = req.query.name;
    project.onshape_id = req.query.oid;
});
exports.createProject = createProject;
//# sourceMappingURL=project.controller.js.map