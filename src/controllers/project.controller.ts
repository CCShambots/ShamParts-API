import {Project} from "../entity/Project";
import {Request, Response} from "express";
import {AppDataSource} from "../data-source";
import {Onshape} from "../util/Onshape";
import {User} from "../entity/User";


export const createProject = async (req:Request, res:Response) => {

    const bodyInfo = req.body

    const projects = await AppDataSource.manager
      .createQueryBuilder(Project, "project")
      .getMany();

    if(projects.some(project => project.onshape_id === bodyInfo.doc_id)) {
        return res.status(400).send("Project already exists");
    }

    let project = new Project();

    project.name = bodyInfo.name as string;
    project.onshape_id = bodyInfo.doc_id as string;
    project.default_workspace = bodyInfo.default_workspace as string;
    project.assembly_onshape_id = bodyInfo.main_assembly as string;
    project.assembly_name = bodyInfo.name + " Main Assembly" as string;

    project.parts =
        await Onshape.getPartsFromAssembly(
            project
        );

    console.log(project.parts)

    await AppDataSource.manager.save(project);

    return res.status(200).send(project);

}

export const getProjects = async (req:Request, res:Response) => {
    const user = await User.getUserFromRandomToken(req.headers.token as string)

    if(!user) {
        return res.status(404).send("User not found");
    }

    let projects = user.projects;

    //If the user is an admin, return all projects
    if(user.roles.includes('admin')) {
        projects = await AppDataSource.manager
          .createQueryBuilder(Project, "project")
          .getMany();
    }

    return res.send(projects.map(e => e.name));
}

export const getProject = async (req:Request, res:Response) => {
    //TODO: Make loading of individual parts work

    //Check if user is involved in this project
    const user = await User.getUserFromRandomToken(req.headers.token as string)

    if(!user) {
        return res.status(404).send("User not found");
    }

    const project = user.projects.filter(e => e.name === req.params.name)[0];

    if(!project) {
        return res.status(404).send("Project not found");
    }

    project.individual_parts = [];
    
    return res.send(project);
}