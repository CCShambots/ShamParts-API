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
exports.getProject = exports.getProjects = exports.createProject = void 0;
const Project_1 = require("../entity/Project");
const data_source_1 = require("../data-source");
const Onshape_1 = require("../util/Onshape");
const User_1 = require("../entity/User");
const createProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bodyInfo = req.body;
    const projects = yield data_source_1.AppDataSource.manager
        .createQueryBuilder(Project_1.Project, "project")
        .getMany();
    if (projects.some(project => project.onshape_id === bodyInfo.doc_id)) {
        return res.status(400).send("Project already exists");
    }
    let project = new Project_1.Project();
    project.name = bodyInfo.name;
    project.onshape_id = bodyInfo.doc_id;
    project.default_workspace = bodyInfo.default_workspace;
    project.assembly_onshape_id = bodyInfo.main_assembly;
    project.assembly_name = bodyInfo.name + " Main Assembly";
    project.parts =
        yield Onshape_1.Onshape.getPartsFromAssembly(project);
    console.log(project.parts);
    yield data_source_1.AppDataSource.manager.save(project);
    return res.status(200).send(project);
});
exports.createProject = createProject;
const getProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.User.getUserFromRandomToken(req.headers.token);
    if (!user) {
        return res.status(404).send("User not found");
    }
    let projects = user.projects;
    //If the user is an admin, return all projects
    if (user.roles.includes('admin')) {
        projects = yield data_source_1.AppDataSource.manager
            .createQueryBuilder(Project_1.Project, "project")
            .getMany();
    }
    return res.send(projects.map(e => e.name));
});
exports.getProjects = getProjects;
const getProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //TODO: Make loading of individual parts work
    //Check if user is involved in this project
    const user = yield User_1.User.getUserFromRandomToken(req.headers.token);
    if (!user) {
        return res.status(404).send("User not found");
    }
    const project = user.projects.filter(e => e.name === req.params.name)[0];
    if (!project) {
        return res.status(404).send("Project not found");
    }
    project.individual_parts = [];
    return res.send(project);
});
exports.getProject = getProject;
//# sourceMappingURL=project.controller.js.map