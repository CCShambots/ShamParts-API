import {AppDataSource} from "../data-source";
import {User} from "../entity/User";
import {Request, response, Response} from "express";
import {sendVerificationEmail} from "../util/Mailjet";
import {classToPlain, instanceToPlain} from "class-transformer";
import configJson from "../../config.json";


export const createUser = async (req:Request, res:Response) => {
    const queryParams = req.query

    const users = await AppDataSource.manager
      .createQueryBuilder(User, "user")
      .getMany();

    if(users.some(user => user.email === queryParams.email)) {
        return res.status(400).send("User already exists");
    }

    let user = new User();

    user.email = queryParams.email as string;
    user.name = queryParams.name as string;
    user.verified = false;
    if(configJson.admin_user === user.email) user.roles = ['admin'];
    else user.roles = [];
    //Generate random string for verification
    user.randomToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    user.passwordHash = stringToHash(queryParams.password as string);

    //Send verification email to the user
    let responseStatus = await sendVerificationEmail(user.email, user.name, user.randomToken)

    console.log(responseStatus);

    await AppDataSource.manager.save(user);

    const userPlain = instanceToPlain(user);

    return res.status(200).send(userPlain);
}

function stringToHash(string) {

    let hash = 0;

    if (string.length == 0) return hash.toString();

    for (let i = 0; i < string.length; i++) {
        let char = string.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }

    return hash.toString();
}

export const verifyUser = async (req:Request, res:Response) => {
    const user = await AppDataSource.manager
        .createQueryBuilder(User, "user")
        .where("user.randomToken = :token", {token: req.query.token})
        .getOne();

    if(!user) {
        //Return an error message (could not find user to verify)
        return res.status(404).send("User not found");
    }

    user.verified = true;

    await AppDataSource.manager.save(user);

    //Return a success message (user verified)
    return res.status(200).send("User verified");
}

export const cancelUser = async (req:Request, res:Response) => {
    const user = await AppDataSource.manager
        .createQueryBuilder(User, "user")
        .where("user.randomToken= :token", {token: req.query.token})
        .getOne();

    if(!user) {
        //Return an error message (could not find user to verify)
        return res.status(404).send("User not found");
    }

    await AppDataSource.manager.remove(user);

    //Return a success message (user verified)
    return res.status(200).send("User removed");
}

export const getUsers = async (req:Request, res:Response) => {
    const users = await AppDataSource.manager
        .createQueryBuilder(User, "user")
        .getMany();

    const plainUsers = users.map(e => instanceToPlain(e))

    return res.status(200).send(plainUsers);
}

export const getUser = async  (req:Request, res:Response) => {
    const user = await AppDataSource.manager
        .createQueryBuilder(User, "user")
        .where("user.email = :email", {email: req.query.email})
        .getOne();

    if(!user) {
        return res.status(404).send("User not found");
    }

    return res.status(200).send(instanceToPlain(user));
}
