import {Project} from "../entity/Project";
import {Request, Response} from "express";
import {Assembly} from "../entity/Assembly";
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
    project.main_assembly = new Assembly();
    project.main_assembly.onshape_id = bodyInfo.main_assembly as string;
    project.main_assembly.name = bodyInfo.name + " Main Assembly" as string;

    project.main_assembly.parts =
        await Onshape.getPartsFromAssembly(
            project.onshape_id,
            project.default_workspace,
            project.main_assembly.onshape_id
        );

    console.log(project.main_assembly.parts)

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
        .innerJoinAndSelect("project.main_assembly", "assembly")
        .innerJoinAndSelect("assembly.parts", "part")
        .where("project.name = :name", {name: req.params.name})
        .getOne();

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