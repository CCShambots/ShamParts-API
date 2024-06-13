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
exports.uploadImage = exports.unAssignUser = exports.assignUser = exports.createCompound = void 0;
const User_1 = require("../entity/User");
const Project_1 = require("../entity/Project");
const Compound_1 = require("../entity/Compound");
const data_source_1 = require("../data-source");
const CompoundPart_1 = require("../entity/CompoundPart");
const class_transformer_1 = require("class-transformer");
const Part_1 = require("../entity/Part");
const LogEntry_1 = require("../entity/LogEntry");
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
    project.compounds.push(compound);
    compound.material = req.body.material;
    compound.thickness = req.body.thickness;
    compound.parts = req.body.parts.map((e) => {
        const part = new CompoundPart_1.CompoundPart();
        part.compound = compound;
        part.part_id = e.partId;
        part.quantity = e.quantity;
        return part;
    });
    compound.thumbnail = "";
    compound.camDone = false;
    compound.camInstructions = [];
    //save the project
    yield data_source_1.AppDataSource.manager.save(project);
    res.status(200).send((0, class_transformer_1.instanceToPlain)(compound));
});
exports.createCompound = createCompound;
const assignUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.User.getUserFromRandomToken(req.headers.token);
    if (!user) {
        return res.status(404).send("User not found");
    }
    //Load the user included in the query params
    const asignee = yield User_1.User.getUserFromEmail(req.body.email);
    if (!asignee)
        return res.status(404).send("Asignee not found");
    const id = req.params.id;
    //Load the part object from the database with this id
    const loaded = yield Compound_1.Compound.getCompoundFromId(id);
    LogEntry_1.LogEntry.createLogEntry("assign", -1, asignee.name, user.name).addToCompound(loaded);
    loaded.setAsignee(asignee);
    yield data_source_1.AppDataSource.manager.save(loaded);
    res.status(200).send((0, class_transformer_1.instanceToPlain)(loaded));
});
exports.assignUser = assignUser;
const unAssignUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.User.getUserFromRandomToken(req.headers.token);
    if (!user) {
        return res.status(404).send("User not found");
    }
    const id = req.params.id;
    //Load the part object from the database with this id
    const loaded = yield Part_1.Part.getPartFromId(id);
    LogEntry_1.LogEntry.createLogEntry("assign", -1, loaded.asigneeName, user.name).addToPart(loaded);
    loaded.asigneeName = "";
    loaded.asigneeId = -1;
    yield data_source_1.AppDataSource.manager.save(loaded);
    res.status(200).send((0, class_transformer_1.instanceToPlain)(loaded));
});
exports.unAssignUser = unAssignUser;
const uploadImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.User.getUserFromRandomToken(req.headers.token);
    if (!user) {
        return res.status(404).send("User not found");
    }
    const id = req.params.id;
    //Load the part object from the database with this id
    const loaded = yield Compound_1.Compound.getCompoundFromId(id);
    loaded.thumbnail = req.body.image;
    yield data_source_1.AppDataSource.manager.save(loaded);
    res.status(200).send((0, class_transformer_1.instanceToPlain)(loaded));
});
exports.uploadImage = uploadImage;
//# sourceMappingURL=compound.controller.js.map