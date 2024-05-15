import {Project} from "../entity/Project";
import {Request, Response} from "express";
import {AppDataSource} from "../data-source";
import {Onshape} from "../util/Onshape";
import {User} from "../entity/User";
import {instanceToPlain} from "class-transformer";
import {LogEntry} from "../entity/LogEntry";


export const createProject = async (req: Request, res: Response) => {

    const bodyInfo = req.body

    const projects = await AppDataSource.manager
        .createQueryBuilder(Project, "project")
        .getMany();

    if (projects.some(project => project.onshape_id === bodyInfo.doc_id)) {
        return res.status(400).send("Project already exists");
    }

    let project = new Project();

    project.name = bodyInfo.name as string;
    project.onshape_id = bodyInfo.doc_id as string;
    project.default_workspace = bodyInfo.default_workspace as string;
    project.assembly_onshape_id = bodyInfo.main_assembly as string;
    project.assembly_name = bodyInfo.name + " Main Assembly" as string;
    project.admin_roles = [];
    project.read_roles = [];
    project.write_roles = [];

    project.parts =
        await Onshape.getPartsFromAssembly(
            project
        );

    await AppDataSource.manager.save(project);

    return res.status(200).send(instanceToPlain(project));

}

export const getProjects = async (req: Request, res: Response) => {
    const user = await User.getUserFromRandomToken(req.headers.token as string)

    if (!user) {
        return res.status(404).send("User not found");
    }

    let projects = user.projects;

    //If the user is an admin, return all projects
    if (user.roles.includes('admin')) {
        projects = await AppDataSource.manager
            .createQueryBuilder(Project, "project")
            .getMany();
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

    //If the user has a null project associated with them, create an empty array
    if (user.projects === undefined) {
        user.projects = [];

        await AppDataSource.manager.save(user);
    }

    let project = user.projects.filter(e => e.name === req.params.name)[0];

    //If the user is an admin, just search all projects and load it absolutely
    if (!project && user.roles.includes('admin')) {
        project = await AppDataSource.manager
            .createQueryBuilder(Project, "project")
            .where("project.name = :name", {name: req.params.name})
            .innerJoinAndSelect("project.parts", "part")
            .getOne();
    }

    let logEntries = await AppDataSource.manager
        .createQueryBuilder(LogEntry, "logEntry")
        .innerJoinAndSelect("logEntry.part", "part")
        .getMany();

    //Load the log info
    if (project) {
        for (let part of project.parts) {
            part.logEntries = logEntries.filter(e => e.part.id === part.id);
        }
    }

    if (!project) {
        return res.status(404).send("Project not found");
    }

    //TODO: Fix individual parts issues
    project.individual_parts = [];

    return res.send(instanceToPlain(project));
}