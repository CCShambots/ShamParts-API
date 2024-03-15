import {Request, Response} from "express";
import {Onshape} from "../util/Onshape";

export const getDocuments = async (req:Request, res:Response) => {
    let result = await Onshape.getDocuments(req.query.query as string);
    return res.send(result);
}

export const getAssemblies = async (req:Request, res:Response) => {
    let result = await Onshape.getAssemblies(req.query.did as string, req.query.wid as string);
    return res.send(result);
}