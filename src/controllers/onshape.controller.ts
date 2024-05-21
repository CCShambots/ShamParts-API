import {Onshape} from "../util/Onshape";
import {Request, Response} from "express";
import configJson from "../../config.json";
import {User} from "../entity/User";

export const getDocuments = async (req:Request, res:Response) => {
    let result = await Onshape.getDocuments(req.query.query as string);
    return res.send(result);
}

export const getAssemblies = async (req:Request, res:Response) => {
    let result = await Onshape.getAssemblies(req.query.did as string, req.query.wid as string);
    return res.send(result);
}

export const getOnshapeKey = async (req:Request, res:Response) => {
    //Make sure the user is verified by instantiating the user and checking the verified field
    const user = await User.getUserFromRandomToken(req.headers.token as string)

    if(!user) {
        return res.status(404).send("User not found");
    }

    if(!user.verified) {
        return res.status(403).send("User not verified");
    }

    return res.send(configJson.onshape_auth_code);
}