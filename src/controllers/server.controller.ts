import {Server} from "../entity/Server";
import {Request, Response} from "express";
import {AppDataSource} from "../data-source";
import {instanceToPlain} from "class-transformer";
import {User} from "../entity/User";
import {sendServerVerification} from "../util/Mailjet";
import configJson from "../../config.json";
import {generateRandomToken} from "./user.controller";

export const getServers = async (req: Request, res: Response) => {
    const servers = await AppDataSource.manager.find(Server)

    const plainServers = servers.map(e => instanceToPlain(e))
    return res.status(200).send(plainServers)
}

export const addFollowerServer = async (req: Request, res: Response) => {

    //Check to see if this server already exists
    const existing = await AppDataSource.manager.findOne(Server, {where: {ip: req.body.ip}})
    if (existing) {
        return res.status(200).send("Server already exists")
    }

    const server = new Server()
    server.name = req.body.name
    server.ip = req.body.ip
    server.verified = false
    server.random_token = generateRandomToken();
    await AppDataSource.manager.save(server)

    //Send verificaiton email
    await sendServerVerification(configJson.admin_user, server.name, server.random_token)

    return res.status(200).send(server)
}

export const verifyServer = async (req: Request, res: Response) => {
    const server = await AppDataSource.manager.findOne(Server, {where: {ip: req.body.ip}})
    if (!server) {
        return res.status(404).send("Server not found")
    }

    server.verified = true;
    return res.status(200).send(server)
}

export const denyServer = async (req: Request, res: Response) => {
    const server = await AppDataSource.manager.findOne(Server, {where: {random_token: req.params.token}})
    if (!server) {
        return res.status(404).send("Server not found")
    }

    await AppDataSource.manager.remove(server)
    return res.status(200).send(server)
}

export const deleteServer = async (req: Request, res: Response) => {
    const user = await User.getUserFromRandomToken(req.query.token as string)

    if(!user) {
        //Return an error message (could not find user to verify)
        return res.status(404).send("User not found");
    }

    if(!user.roles.includes('admin')) {
        return res.status(403).send("You must be an admin to do this")
    }

    const server = await AppDataSource.manager.findOne(Server, {where: {ip: req.params.ip}})


    if (!server) {
        return res.status(404).send("Server not found")
    }

    await AppDataSource.manager.remove(server)
    return res.status(200).send(server)
}