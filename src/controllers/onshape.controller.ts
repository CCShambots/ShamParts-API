import {Request, Response} from "express";
import {Onshape} from "../util/Onshape";
import configJson from "../../config.json";

export const getDocuments = async (req:Request, res:Response) => {
    let result = await Onshape.getDocuments(req.query.query as string);
    return res.send(result);
}

export const getAssemblies = async (req:Request, res:Response) => {
    let result = await Onshape.getAssemblies(req.query.did as string, req.query.wid as string);
    return res.send(result);
}

export const getOnshapeKey = async (req:Request, res:Response) => {
    return res.send(configJson.onshape_auth_code);
}