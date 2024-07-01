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
exports.getProject = exports.getProjects = exports.removeRole = exports.addRole = exports.resyncFromOnshape = exports.createProject = void 0;
const Project_1 = require("../entity/Project");
const data_source_1 = require("../data-source");
const Onshape_1 = require("../util/Onshape");
const User_1 = require("../entity/User");
const class_transformer_1 = require("class-transformer");
let creatingProject = false;
const createProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Starting to create project");
    const bodyInfo = req.body;
    const projects = yield data_source_1.AppDataSource.manager
        .createQueryBuilder(Project_1.Project, "project")
        .getMany();
    if (projects.some(project => project.onshape_id === bodyInfo.doc_id)) {
        return res.status(400).send("Project already exists");
    }
    if (creatingProject) {
        return res.status(400).send("A project is already being created");
    }
    creatingProject = true;
    let project = new Project_1.Project();
    project.name = bodyInfo.name;
    project.onshape_id = bodyInfo.doc_id;
    project.default_workspace = bodyInfo.default_workspace;
    project.assembly_onshape_id = bodyInfo.main_assembly;
    project.assembly_name = bodyInfo.name + " Main Assembly";
    project.admin_roles = [];
    project.read_roles = [];
    project.write_roles = [];
    project.lastSyncDate = new Date(Date.now());
    project.compounds = [];
    project.parts =
        yield Onshape_1.Onshape.getPartsFromAssembly(project);
    yield data_source_1.AppDataSource.manager.save(project);
    creatingProject = false;
    return res.status(200).send((0, class_transformer_1.instanceToPlain)(project));
});
exports.createProject = createProject;
const resyncFromOnshape = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.User.getUserFromRandomToken(req.headers.token);
    if (!user) {
        return res.status(404).send("User not found");
    }
    let project = yield Project_1.Project.loadProject(req.params.name);
    if (!project.userIsAdmin(user)) {
        return res.status(403).send("You do not have this permission.");
    }
    if (!project) {
        return res.status(404).send("Project not found");
    }
    if (!project.userIsAdmin(user)) {
        return res.status(403).send("You do not have access to this project");
    }
    project.parts =
        yield Onshape_1.Onshape.getPartsFromAssembly(project);
    project.lastSyncDate = new Date(Date.now());
    yield data_source_1.AppDataSource.manager.save(project);
    return res.status(200).send((0, class_transformer_1.instanceToPlain)(project));
});
exports.resyncFromOnshape = resyncFromOnshape;
const addRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.User.getUserFromRandomToken(req.headers.token);
    if (!user) {
        return res.status(404).send("User not found");
    }
    // Require user to be an absolute admin (not a project admin) to do this
    if (!user.roles.includes('admin')) {
        return res.status(403).send("You must be an admin to do this");
    }
    const project = yield data_source_1.AppDataSource.manager
        .createQueryBuilder(Project_1.Project, "project")
        .where("project.name = :name", { name: req.params.name })
        .getOne();
    if (!project) {
        return res.status(404).send("Project not found");
    }
    //Don't allow if it already contains this role
    if (project.getAllRoles().includes(req.body.role)) {
        return res.status(400).send("Role already exists");
    }
    if (req.body.type === 'admin') {
        project.admin_roles.push(req.body.role);
    }
    else if (req.body.type === 'write') {
        project.write_roles.push(req.body.role);
    }
    else if (req.body.type === 'read') {
        project.read_roles.push(req.body.role);
    }
    else {
        return res.status(400).send("Invalid role");
    }
    yield data_source_1.AppDataSource.manager.save(project);
    return res.status(200).send((0, class_transformer_1.instanceToPlain)(project));
});
exports.addRole = addRole;
const removeRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.User.getUserFromRandomToken(req.headers.token);
    if (!user) {
        return res.status(404).send("User not found");
    }
    // Require user to be a server-wide admin (not a project admin) to do this
    if (!user.roles.includes('admin')) {
        return res.status(403).send("You must be an admin to do this");
    }
    const project = yield data_source_1.AppDataSource.manager
        .createQueryBuilder(Project_1.Project, "project")
        .where("project.name = :name", { name: req.params.name })
        .getOne();
    if (!project) {
        return res.status(404).send("Project not found");
    }
    if (req.body.type === 'admin') {
        project.admin_roles = project.admin_roles.filter(e => e !== req.body.role);
    }
    else if (req.body.type === 'write') {
        project.write_roles = project.write_roles.filter(e => e !== req.body.role);
    }
    else if (req.body.type === 'read') {
        project.read_roles = project.read_roles.filter(e => e !== req.body.role);
    }
    else {
        return res.status(400).send("Invalid role");
    }
    yield data_source_1.AppDataSource.manager.save(project);
    return res.status(200).send((0, class_transformer_1.instanceToPlain)(project));
});
exports.removeRole = removeRole;
const getProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.User.getUserFromRandomToken(req.headers.token);
    if (!user) {
        return res.status(404).send("User not found");
    }
    //Load all projects, sort them for roles the user has
    let projects = yield data_source_1.AppDataSource.manager
        .createQueryBuilder(Project_1.Project, "project")
        .getMany();
    //If the user is an admin, return all projects
    if (user.roles.includes('admin')) { }
    else {
        projects = projects.filter(e => {
            return e.userHasAccess(user);
        });
    }
    if (!projects) {
        return res.status(404).send("Projects not found");
    }
    return res.send(projects.map(e => e.name));
});
exports.getProjects = getProjects;
const getProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //Check if user is involved in this project
    const user = yield User_1.User.getUserFromRandomToken(req.headers.token);
    if (!user) {
        return res.status(404).send("User not found");
    }
    let project = yield Project_1.Project.loadProject(req.params.name);
    if (!project) {
        return res.status(404).send("Project not found");
    }
    //If the user is an admin, just search all projects and load it absolutely
    if (!project.userHasAccess(user)) {
        return res.status(403).send("You do not have access to this project");
    }
    if (!project) {
        return res.status(404).send("Project not found");
    }
    return res.send((0, class_transformer_1.instanceToPlain)(project));
});
exports.getProject = getProject;
//# sourceMappingURL=project.controller.js.map