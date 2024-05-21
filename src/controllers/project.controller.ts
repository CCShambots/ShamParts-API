import {Project} from "../entity/Project";
import {Request, Response} from "express";
import {AppDataSource} from "../data-source";
import {Onshape} from "../util/Onshape";
import {User} from "../entity/User";
import {instanceToPlain} from "class-transformer";
import {LogEntry} from "../entity/LogEntry";
import {PartCombine} from "../entity/PartCombine";

let creatingProject = false;

export const createProject = async (req: Request, res: Response) => {

    const bodyInfo = req.body

    const projects = await AppDataSource.manager
        .createQueryBuilder(Project, "project")
        .getMany();

    if (projects.some(project => project.onshape_id === bodyInfo.doc_id)) {
        return res.status(400).send("Project already exists");
    }

    if (creatingProject) {
        return res.status(400).send("A project is already being created");
    }

    creatingProject = true;

    let project = new Project();

    project.name = bodyInfo.name as string;
    project.onshape_id = bodyInfo.doc_id as string;
    project.default_workspace = bodyInfo.default_workspace as string;
    project.assembly_onshape_id = bodyInfo.main_assembly as string;
    project.assembly_name = bodyInfo.name + " Main Assembly" as string;
    project.admin_roles = [];
    project.read_roles = [];
    project.write_roles = [];

    project.compounds = [];

    project.parts =
        await Onshape.getPartsFromAssembly(
            project
        );

    await AppDataSource.manager.save(project);

    creatingProject = false;

    return res.status(200).send(instanceToPlain(project));

}

export const addRole = async (req: Request, res: Response) => {
    const user = await User.getUserFromRandomToken(req.headers.token as string)

    if (!user) {
        return res.status(404).send("User not found");
    }

    // Require user to be an admin to do this
    if (!user.roles.includes('admin')) {
        return res.status(403).send("You must be an admin to do this");
    }

    const project = await AppDataSource.manager
        .createQueryBuilder(Project, "project")
        .where("project.name = :name", {name: req.params.name})
        .getOne();

    if (!project) {
        return res.status(404).send("Project not found");
    }

    //Don't allow if it already contains this role
    if (project.getAllRoles().includes(req.body .role as string)) {
        return res.status(400).send("Role already exists");
    }

    if (req.body.type === 'admin') {
        project.admin_roles.push(req.body.role as string);
    } else if (req.body.type === 'write') {
        project.write_roles.push(req.body.role as string);
    } else if (req.body.type === 'read') {
        project.read_roles.push(req.body.role as string);
    } else {
        return res.status(400).send("Invalid role");
    }

    await AppDataSource.manager.save(project);

    return res.status(200).send(instanceToPlain(project));

}

export const removeRole = async (req: Request, res: Response) => {

    const user = await User.getUserFromRandomToken(req.headers.token as string)

    if (!user) {
        return res.status(404).send("User not found");
    }

    // Require user to be an admin to do this
    if (!user.roles.includes('admin')) {
        return res.status(403).send("You must be an admin to do this");
    }

    const project = await AppDataSource.manager
        .createQueryBuilder(Project, "project")
        .where("project.name = :name", {name: req.params.name})
        .getOne();

    if (!project) {
        return res.status(404).send("Project not found");
    }

    if (req.body.type === 'admin') {
        project.admin_roles = project.admin_roles.filter(e => e !== req.body.role);
    } else if (req.body.type === 'write') {
        project.write_roles = project.write_roles.filter(e => e !== req.body.role);
    } else if (req.body.type === 'read') {
        project.read_roles = project.read_roles.filter(e => e !== req.body.role);
    } else {
        return res.status(400).send("Invalid role");
    }

    await AppDataSource.manager.save(project);

    return res.status(200).send(instanceToPlain(project));
}

export const getProjects = async (req: Request, res: Response) => {
    const user = await User.getUserFromRandomToken(req.headers.token as string)

    if (!user) {
        return res.status(404).send("User not found");
    }

    //Load all projects, sort them for roles the user has

    let projects = await AppDataSource.manager
        .createQueryBuilder(Project, "project")
        .getMany();

    console.log(projects)

    //If the user is an admin, return all projects
    if (user.roles.includes('admin')) {}
    else {
        projects = projects.filter(e => {
            return e.getAllRoles().filter(ele => user.roles.includes(ele)).length > 0;
        })
    }
    
    if (!projects) {
        return res.status(404).send("Projects not found");
    }

    return res.send(projects.map(e => e.name));
}

export const getProject = async (req: Request, res: Response) => {
    //TODO: Make loading of individual parts work

    //Check if user is involved in this project
    const user = await User.getUserFromRandomToken(req.headers.token as string)

    if (!user) {
        return res.status(404).send("User not found");
    }

    let project = await Project.loadProject(req.params.name);

    if(!project){
        return res.status(404).send("Project not found");
    }

    //If the user is an admin, just search all projects and load it absolutely
    if (!user.roles.includes('admin') && !project.userHasAccess(user)) {
        return res.status(403).send("You do not have access to this project");
    }

    if (!project) {
        return res.status(404).send("Project not found");
    }

    //TODO: Fix individual parts issues
    project.individual_parts = [];

    return res.send(instanceToPlain(project));
}