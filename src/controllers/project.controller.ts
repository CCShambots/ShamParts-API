import {Project} from "../entity/Project";
import {Request, Response} from "express";


export const createProject = async (req:Request, res:Response) => {
    let project = new Project();
    project.name = req.query.name as string;
    project.onshape_id = req.query.oid as string;



}