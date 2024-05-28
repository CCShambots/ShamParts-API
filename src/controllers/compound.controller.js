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
exports.createCompound = void 0;
const User_1 = require("../entity/User");
const Project_1 = require("../entity/Project");
const Compound_1 = require("../entity/Compound");
const createCompound = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //Check user is correct
    //Check if user is involved in this project
    const user = yield User_1.User.getUserFromRandomToken(req.headers.token);
    if (!user) {
        return res.status(404).send("User not found");
    }
    const project = yield Project_1.Project.loadProject(req.body.projectName);
    if (!project) {
        return res.status(404).send("Project not found");
    }
    if (!project.userCanWrite(user)) {
        return res.status(403).send("You do not have write access to this project");
    }
    //Check if this compound already exists
    if (project.compounds.filter(e => e.name === req.body.name).length > 0) {
        return res.status(400).send("This compound name already exists");
    }
    const compound = new Compound_1.Compound();
    compound.name = req.body.name;
    compound.project = project;
    compound.material = req.body.material;
    compound.thickness = req.body.thickness;
    compound.parts = req.body.parts;
});
exports.createCompound = createCompound;
//# sourceMappingURL=compound.controller.js.map