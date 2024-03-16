import {Project} from "../entity/Project";
import {Request, Response} from "express";
import {Assembly} from "../entity/Assembly";


export const createProject = async (req:Request, res:Response) => {
    console.log(req.body);

    const bodyInfo = req.body

    let project = new Project();
    project.name = bodyInfo.name as string;
    project.onshape_id = bodyInfo.doc_id as string;
    project.mainAssembly = new Assembly();
    project.mainAssembly.onshape_id = bodyInfo.main_assembly as string;

    return res.status(400).send("Not implemented");

}