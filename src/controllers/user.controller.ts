import {AppDataSource} from "../data-source";
import {User} from "../entity/User";
import {Request, response, Response} from "express";
import {sendVerificationEmail} from "../util/Mailjet";
import {classToPlain, instanceToPlain} from "class-transformer";
import configJson from "../../config.json";
import path from 'path';


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

function generateRandomToken() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

}

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
    user.randomToken = generateRandomToken();

    //Check if this random token already exists on another user and re-roll if necessary
    while(users.some(e => e.randomToken === user.randomToken)) {
        user.randomToken = generateRandomToken();
    }

    user.passwordHash = stringToHash(queryParams.password as string);

    //Send verification email to the user
    let responseStatus = await sendVerificationEmail(user.email, user.name, user.randomToken)

    console.log(responseStatus);

    await AppDataSource.manager.save(user);

    const userPlain = instanceToPlain(user);

    return res.status(200).send(userPlain);
}

export const verifyUser = async (req:Request, res:Response) => {
    const user = await User.getUserFromRandomToken(req.query.token as string)

    if(!user) {
        //Return an error message (could not find user to verify)
        return res.status(404).send("User not found");
    }

    user.verified = true;

    await AppDataSource.manager.save(user);

    //Return a success message (user verified)
    return res.status(200).send("User verified");
}

export const authenticateUser = async (req:Request, res:Response) => {
    const user = await User.getUserFromEmail(req.query.email as string)

    if(!user) {
        return res.status(404).send("User not found");
    }

    if(user.passwordHash !== stringToHash(req.query.password)) return res.status(403).send("Invalid token");

    return res.status(200).send(user);
}

export const cancelUser = async (req:Request, res:Response) => {
    const user = await User.getUserFromRandomToken(req.query.token as string)

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
    const user = await User.getUserFromEmail(req.query.email as string)

    if(!user) {
        return res.status(404).send("User not found");
    }

    return res.status(200).send(instanceToPlain(user));
}

export const forgotPassword = async (req:Request, res:Response) => {
    const user = await User.getUserFromEmail(req.query.email as string)

    if(!user) {
        return res.status(404).send("User not found");
    }

    user.randomToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    await AppDataSource.manager.save(user);

    let responseStatus = await sendVerificationEmail(user.email, user.name, user.randomToken)

    console.log(responseStatus);

    return res.status(200).send("Email sent");
}

export const resetPasswordPage = async (req:Request, res:Response) => {

    res.sendFile(path.join(__dirname, '/ResetPassword.html'));
}

export const resetPassword = async (req:Request, res:Response) => {
    console.log(req.query)
    console.log(req.query.token)

    const user = await User.getUserFromRandomToken(req.query.token as string)

    if(!user) {
        return res.status(404).send("User not found");
    }

    user.passwordHash = stringToHash(req.query.password);

    await AppDataSource.manager.save(user);

    return res.status(200).send("Password reset");
}

export const deleteUser = async (req:Request, res:Response) => {
    const user = await User.getUserFromEmail(req.query.email as string)

    if(!user) {
        return res.status(404).send("User not found");
    }

    if(user.passwordHash !== stringToHash(req.query.password)) return res.status(403).send("Invalid token");

    await AppDataSource.manager.remove(user);

    return res.status(200).send("User deleted");
}