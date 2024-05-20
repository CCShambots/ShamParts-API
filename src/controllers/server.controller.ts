import {Server} from "../entity/Server";
import {Request, Response} from "express";
import {AppDataSource} from "../data-source";

export const getServers = async (req: Request, res: Response) => {
    const servers = await AppDataSource.manager.find(Server)
    return res.status(200).send(servers)
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
    await AppDataSource.manager.save(server)
    return res.status(200).send(server)
}