import {Request, Response} from "express";
import {Onshape} from "../util/Onshape";

export const getDocuments = async (req:Request, res:Response) => {
    let result = await Onshape.getDocuments(req.query.query as string);
    return res.send(result);
}