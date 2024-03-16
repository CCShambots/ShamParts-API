import {Project} from "../entity/Project";
import {Request, Response} from "express";
import {Assembly} from "../entity/Assembly";
import {AppDataSource} from "../data-source";
import {Onshape} from "../util/Onshape";


export const createProject = async (req:Request, res:Response) => {
    console.log(req.body);

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
    project.mainAssembly = new Assembly();
    project.mainAssembly.onshape_id = bodyInfo.main_assembly as string;

    Onshape.getPartsFromAssembly(project.onshape_id, project.default_workspace, project.mainAssembly.onshape_id)

    return res.status(400).send("Not implemented");

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