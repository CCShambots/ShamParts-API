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
exports.testMultiResult = exports.getProject = exports.getProjects = exports.createProject = void 0;
const Project_1 = require("../entity/Project");
const Assembly_1 = require("../entity/Assembly");
const data_source_1 = require("../data-source");
const Onshape_1 = require("../util/Onshape");
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
    project.main_assembly = new Assembly_1.Assembly();
    project.main_assembly.onshape_id = bodyInfo.main_assembly;
    project.main_assembly.name = bodyInfo.name + " Main Assembly";
    project.main_assembly.parts =
        yield Onshape_1.Onshape.getPartsFromAssembly(project.onshape_id, project.default_workspace, project.main_assembly.onshape_id);
    console.log(project.main_assembly.parts);
    yield data_source_1.AppDataSource.manager.save(project);
    return res.status(200).send(project);
});
exports.createProject = createProject;
const getProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const projects = yield data_source_1.AppDataSource.manager
        .createQueryBuilder(Project_1.Project, "project")
        .getMany();
    return res.send(projects.map(e => e.name));
});
exports.getProjects = getProjects;
const getProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //TODO: Make loading of individual parts work
    const project = yield data_source_1.AppDataSource.manager
        .createQueryBuilder(Project_1.Project, "project")
        .innerJoinAndSelect("project.main_assembly", "assembly")
        .innerJoinAndSelect("assembly.parts", "part")
        .where("project.name = :name", { name: req.params.name })
        .getOne();
    project.individual_parts = [];
    return res.send(project);
});
exports.getProject = getProject;
const testMultiResult = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    //Use req.write to send a message every two seconds
    let i = 0;
    const interval = setInterval(() => {
        res.write(`Message ${i}\n`);
        i++;
        if (i === 5) {
            clearInterval(interval);
            res.end();
        }
    }, 2000);
});
exports.testMultiResult = testMultiResult;
//# sourceMappingURL=project.controller.js.map