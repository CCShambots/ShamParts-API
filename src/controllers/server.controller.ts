import {Server} from "../entity/Server";
import {Request, Response} from "express";
import {AppDataSource} from "../data-source";
import {instanceToPlain} from "class-transformer";
import {User} from "../entity/User";
import {sendServerVerification} from "../util/Mailjet";
import configJson from "../../config.json";

export function generateSafeRandomToken(disallowedStrings: String[]) {

    let val = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    while (disallowedStrings.includes(val)) {
        val = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
    return val;
}

export function generateSafeKey(disallowedKeys: String[]) {
    let key = generateAlphanumericKey();
    while (disallowedKeys.includes(key)) {
        key = generateAlphanumericKey();
    }
    return key;

}

function generateAlphanumericKey() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let key = '';
    for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        key += characters[randomIndex];
    }
    return key;
}


export const getServers = async (req: Request, res: Response) => {
    const user = await User.getUserFromRandomToken(req.headers.token as string)

    if (!user) {
        return res.status(404).send("User not found");
    } else if (!user.isAdmin()) {
        return res.status(403).send("You must be an admin to do this")
    }

    let servers = await AppDataSource.manager.find(Server)

    servers = servers.filter(e => e.verified)

    const plainServers = servers.map(e => instanceToPlain(e))
    return res.status(200).send(plainServers)
}

export const getServersFromKeys = async (req: Request, res: Response) => {
    let keys = req.query.keys as string[];

    let servers = await AppDataSource.manager
        .createQueryBuilder(Server, "server").getMany();

    servers.filter(e => keys.includes(e.key))

    return res.status(200).send(servers.map(e => instanceToPlain(e)));
}

export const getServer = async (req: Request, res: Response) => {
    const server = await AppDataSource.manager.findOne(Server, {where: {key: req.params.key}})
    if (!server) {
        return res.status(404).send("Server not found")
    }

    return res.status(200).send(instanceToPlain(server))

}

export const checkForValidServer = async (req: Request, res: Response) => {
    const server = await AppDataSource.manager.findOne(Server, {where: {key: req.params.key}})
    if (!server) {
        return res.status(404).send("Server not found")
    }

    return res.status(200).send(server.verified)

}

export const addFollowerServer = async (req: Request, res: Response) => {

    //Check to see if this server already exists
    const existing = await AppDataSource.manager.findOne(Server, {where: {ip: req.body.ip}})
    if (existing) {
        return res.status(403).send("Server already exists")
    }

    let servers = await AppDataSource.manager.find(Server)

    if (servers.filter(e => e.name === req.body.name).length > 0) {
        return res.status(403).send("Server name already exists")
    }

    const server = new Server()
    server.name = req.body.name
    server.ip = req.body.ip
    server.verified = false

    server.key = generateSafeKey(servers.map(e => e.key))
    server.random_token = generateSafeRandomToken(servers.map(e => e.random_token));
    await AppDataSource.manager.save(server)

    //Send verificaiton email
    await sendServerVerification(configJson.admin_user, server.name, server.random_token)

    return res.status(200).send(server)
}

export const verifyServer = async (req: Request, res: Response) => {
    const server = await AppDataSource.manager.findOne(Server, {where: {random_token: req.body.token}})
    if (!server) {
        return res.status(404).send("Server not found")
    }

    server.verified = true;
    await AppDataSource.manager.save(server)
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

    if (!user) {
        //Return an error message (could not find user to verify)
        return res.status(404).send("User not found");
    }

    if (!user.roles.includes('admin')) {
        return res.status(403).send("You must be an admin to do this")
    }

    const server = await AppDataSource.manager.findOne(Server, {where: {ip: req.params.ip}})


    if (!server) {
        return res.status(404).send("Server not found")
    }

    await AppDataSource.manager.remove(server)
    return res.status(200).send(server)
}