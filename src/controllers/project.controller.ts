import {Project} from "../entity/Project";
import {Request, Response} from "express";
import {AppDataSource} from "../data-source";
import {Onshape} from "../util/Onshape";


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
    const projects = await AppDataSource.manager
      .createQueryBuilder(Project, "project")
      .getMany();

    return res.send(projects.map(e => e.name));
}

export const getProject = async (req:Request, res:Response) => {

    //TODO: Make loading of individual parts work

    const project = await AppDataSource.manager
      .createQueryBuilder(Project, "project")
        .innerJoinAndSelect("project.parts", "part")
        .where("project.name = :name", {name: req.params.name})
        .getOne();

    if(project === null) return res.status(404).send("Project not found");

    project.individual_parts = [];
    
    return res.send(project);
}

export const testMultiResult = async (req:Request, res:Response) => {

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    //Use req.write to send a message every two seconds
    let i = 0;
    const interval = setInterval(() => {
        res.write(`Message ${i}\n`);
        i++;
        if(i === 5) {
            clearInterval(interval);
            res.end();
        }
    }, 2000);

}