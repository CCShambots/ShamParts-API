import {AppDataSource} from "../data-source";
import {User} from "../entity/User";
import {Request, Response} from "express";
import {sendPasswordResetEmail, sendVerificationEmail} from "../util/Mailjet";
import {instanceToPlain} from "class-transformer";
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

export function generateRandomToken() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export const getRoles = async (req:Request, res:Response) => {
    return res.status(200).send(configJson.roles);
}

export const createUser = async (req:Request, res:Response) => {

    if(!req.query.email || !req.query.password || !req.query.name) return res.status(400).send("Missing parameters");

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

export const sendEmail = async (req:Request, res:Response) => {
    const user = await User.getUserFromEmail(req.query.email as string)

    if(!user) {
        return res.status(404).send("User not found");
    }

    let responseStatus = await sendVerificationEmail(user.email, user.name, user.randomToken)

    console.log(responseStatus);

    return res.status(200).send("Email sent");
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

    if(!user.verified) return res.status(403).send("User not verified");

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

export const addUserRole = async (req:Request, res:Response) => {

    //Authenticate the token
    if(!req.headers.token) return res.status(400).send("Missing token");

    //Load the user from the token
    let postingUser = await User.getUserFromRandomToken(req.headers.token as string)

    if(!postingUser.roles.includes("admin")) return res.status(403).send("Unauthorized");

    const user = await User.getUserFromEmail(req.query.email as string)

    if(!user) {
        return res.status(404).send("User not found");
    }

    //Prevent adding duplicate roles
    if(user.roles.includes(req.query.role as string)) return res.status(400).send("User already has role");

    user.roles.push(req.query.role as string);

    await AppDataSource.manager.save(user);

    return res.status(200).send("Role added");

}

export const setUserRoles = async (req:Request, res:Response) => {

    //Authenticate the token
    if(!req.headers.token) return res.status(400).send("Missing token");

    //Load the user from the token
    let postingUser = await User.getUserFromRandomToken(req.headers.token as string)

    if(!postingUser.roles.includes("admin")) return res.status(403).send("Unauthorized");

    const user = await User.getUserFromEmail(req.query.email as string)

    if(!user) {
        return res.status(404).send("User not found");
    }

    user.roles = (req.query.roles as string).split(",");

    await AppDataSource.manager.save(user);

    return res.status(200).send("Role added");

}

export const removeUserRole = async (req:Request, res:Response) => {

    //Authenticate the token
    if(!req.headers.token) return res.status(400).send("Missing token");

    //Load the user from the token
    let postingUser = await User.getUserFromRandomToken(req.headers.token as string)

    if(!postingUser.roles.includes("admin")) return res.status(403).send("Unauthorized");

    const user = await User.getUserFromEmail(req.query.email as string)

    if(!user) {
        return res.status(404).send("User not found");
    }

    const removingRole = req.query.role as string;

    if(postingUser.email === user.email && removingRole === "admin") return res.status(403).send("Cannot remove own admin role");
    if(user.email === configJson.admin_user && removingRole === "admin") return res.status(403).send("Cannot de-admin the uber-admin");

    let originalRoles = user.roles;

    user.roles = user.roles.filter(e => e !== removingRole);

    if(originalRoles.length === user.roles.length) return res.status(400).send("Role not found");

    await AppDataSource.manager.save(user);

    return res.status(200).send("Role removed");

}

export const getUsers = async (req:Request, res:Response) => {

    //Authenticate the token
    if(!req.headers.token) return res.status(400).send("Missing token");

    let verificationStatus = await verifyUserFromToken(req.headers.token as string)

    if(verificationStatus !== 200) return res.status(verificationStatus).send("Invalid token");

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

export const getUserFromToken = async  (req:Request, res:Response) => {
    const user = await User.getUserFromRandomToken(req.query.token as string)

    if(!user) {
        return res.status(404).send("User not found");
    }

    return res.status(200).send(instanceToPlain(user));
}

export const changeUserName = async (req:Request, res:Response) => {
    const user = await User.getUserFromRandomToken(req.query.token as string)

    if(!user) {
        return res.status(404).send("User not found");
    }

    user.name = req.query.name as string;

    await AppDataSource.manager.save(user);

    return res.status(200).send("Name changed");

}

export const forgotPassword = async (req:Request, res:Response) => {
    const user = await User.getUserFromEmail(req.query.email as string)

    if(!user) {
        return res.status(404).send("User not found");
    }

    user.randomToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    await AppDataSource.manager.save(user);

    let responseStatus = await sendPasswordResetEmail(user.email, user.name, user.randomToken)

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

    if(user.passwordHash !== stringToHash(req.query.password)) return res.status(403).send("Incorrect Password");

    await AppDataSource.manager.remove(user);

    return res.status(200).send("User deleted");
}

async function verifyUserFromToken(token:string) {
    let user = await User.getUserFromRandomToken(token)

    if(!user) return 403;
    if(!user.verified) return 403;
    else return 200;
}