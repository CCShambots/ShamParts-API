"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.resetPassword = exports.resetPasswordPage = exports.forgotPassword = exports.changeUserName = exports.getUserFromToken = exports.getUser = exports.getUsers = exports.removeUserRole = exports.setUserRoles = exports.addUserRole = exports.cancelUser = exports.authenticateUser = exports.verifyUser = exports.createUser = exports.getRoles = void 0;
const data_source_1 = require("../data-source");
const User_1 = require("../entity/User");
const Mailjet_1 = require("../util/Mailjet");
const class_transformer_1 = require("class-transformer");
const config_json_1 = __importDefault(require("../../config.json"));
const path_1 = __importDefault(require("path"));
function stringToHash(string) {
    let hash = 0;
    if (string.length == 0)
        return hash.toString();
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
const getRoles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(200).send(config_json_1.default.roles);
});
exports.getRoles = getRoles;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.query.email || !req.query.password || !req.query.name)
        return res.status(400).send("Missing parameters");
    const queryParams = req.query;
    const users = yield data_source_1.AppDataSource.manager
        .createQueryBuilder(User_1.User, "user")
        .getMany();
    if (users.some(user => user.email === queryParams.email)) {
        return res.status(400).send("User already exists");
    }
    let user = new User_1.User();
    user.email = queryParams.email;
    user.name = queryParams.name;
    user.verified = false;
    if (config_json_1.default.admin_user === user.email)
        user.roles = ['admin'];
    else
        user.roles = [];
    //Generate random string for verification
    user.randomToken = generateRandomToken();
    //Check if this random token already exists on another user and re-roll if necessary
    while (users.some(e => e.randomToken === user.randomToken)) {
        user.randomToken = generateRandomToken();
    }
    user.passwordHash = stringToHash(queryParams.password);
    //Send verification email to the user
    let responseStatus = yield (0, Mailjet_1.sendVerificationEmail)(user.email, user.name, user.randomToken);
    console.log(responseStatus);
    yield data_source_1.AppDataSource.manager.save(user);
    const userPlain = (0, class_transformer_1.instanceToPlain)(user);
    return res.status(200).send(userPlain);
});
exports.createUser = createUser;
const verifyUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.User.getUserFromRandomToken(req.query.token);
    if (!user) {
        //Return an error message (could not find user to verify)
        return res.status(404).send("User not found");
    }
    user.verified = true;
    yield data_source_1.AppDataSource.manager.save(user);
    //Return a success message (user verified)
    return res.status(200).send("User verified");
});
exports.verifyUser = verifyUser;
const authenticateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.User.getUserFromEmail(req.query.email);
    if (!user) {
        return res.status(404).send("User not found");
    }
    if (user.passwordHash !== stringToHash(req.query.password))
        return res.status(403).send("Invalid token");
    if (!user.verified)
        return res.status(403).send("User not verified");
    return res.status(200).send(user);
});
exports.authenticateUser = authenticateUser;
const cancelUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.User.getUserFromRandomToken(req.query.token);
    if (!user) {
        //Return an error message (could not find user to verify)
        return res.status(404).send("User not found");
    }
    yield data_source_1.AppDataSource.manager.remove(user);
    //Return a success message (user verified)
    return res.status(200).send("User removed");
});
exports.cancelUser = cancelUser;
const addUserRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //Authenticate the token
    if (!req.headers.token)
        return res.status(400).send("Missing token");
    //Load the user from the token
    let postingUser = yield User_1.User.getUserFromRandomToken(req.headers.token);
    if (!postingUser.roles.includes("admin"))
        return res.status(403).send("Unauthorized");
    const user = yield User_1.User.getUserFromEmail(req.query.email);
    if (!user) {
        return res.status(404).send("User not found");
    }
    user.roles.push(req.query.role);
    yield data_source_1.AppDataSource.manager.save(user);
    return res.status(200).send("Role added");
});
exports.addUserRole = addUserRole;
const setUserRoles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //Authenticate the token
    if (!req.headers.token)
        return res.status(400).send("Missing token");
    //Load the user from the token
    let postingUser = yield User_1.User.getUserFromRandomToken(req.headers.token);
    if (!postingUser.roles.includes("admin"))
        return res.status(403).send("Unauthorized");
    const user = yield User_1.User.getUserFromEmail(req.query.email);
    if (!user) {
        return res.status(404).send("User not found");
    }
    user.roles = req.query.roles.split(",");
    yield data_source_1.AppDataSource.manager.save(user);
    return res.status(200).send("Role added");
});
exports.setUserRoles = setUserRoles;
const removeUserRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //Authenticate the token
    if (!req.headers.token)
        return res.status(400).send("Missing token");
    //Load the user from the token
    let postingUser = yield User_1.User.getUserFromRandomToken(req.headers.token);
    if (!postingUser.roles.includes("admin"))
        return res.status(403).send("Unauthorized");
    const user = yield User_1.User.getUserFromEmail(req.query.email);
    if (!user) {
        return res.status(404).send("User not found");
    }
    const removingRole = req.query.role;
    if (postingUser.email === user.email && removingRole === "admin")
        return res.status(403).send("Cannot remove own admin role");
    let originalRoles = user.roles;
    user.roles = user.roles.filter(e => e !== removingRole);
    if (originalRoles.length === user.roles.length)
        return res.status(400).send("Role not found");
    yield data_source_1.AppDataSource.manager.save(user);
    return res.status(200).send("Role removed");
});
exports.removeUserRole = removeUserRole;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //Authenticate the token
    if (!req.headers.token)
        return res.status(400).send("Missing token");
    let verificationStatus = yield verifyUserFromToken(req.headers.token);
    if (verificationStatus !== 200)
        return res.status(verificationStatus).send("Invalid token");
    const users = yield data_source_1.AppDataSource.manager
        .createQueryBuilder(User_1.User, "user")
        .getMany();
    const plainUsers = users.map(e => (0, class_transformer_1.instanceToPlain)(e));
    return res.status(200).send(plainUsers);
});
exports.getUsers = getUsers;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.User.getUserFromEmail(req.query.email);
    if (!user) {
        return res.status(404).send("User not found");
    }
    return res.status(200).send((0, class_transformer_1.instanceToPlain)(user));
});
exports.getUser = getUser;
const getUserFromToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.User.getUserFromRandomToken(req.query.token);
    if (!user) {
        return res.status(404).send("User not found");
    }
    return res.status(200).send((0, class_transformer_1.instanceToPlain)(user));
});
exports.getUserFromToken = getUserFromToken;
const changeUserName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.User.getUserFromRandomToken(req.query.token);
    if (!user) {
        return res.status(404).send("User not found");
    }
    user.name = req.query.name;
    yield data_source_1.AppDataSource.manager.save(user);
    return res.status(200).send("Name changed");
});
exports.changeUserName = changeUserName;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.User.getUserFromEmail(req.query.email);
    if (!user) {
        return res.status(404).send("User not found");
    }
    user.randomToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    yield data_source_1.AppDataSource.manager.save(user);
    let responseStatus = yield (0, Mailjet_1.sendPasswordResetEmail)(user.email, user.name, user.randomToken);
    console.log(responseStatus);
    return res.status(200).send("Email sent");
});
exports.forgotPassword = forgotPassword;
const resetPasswordPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.sendFile(path_1.default.join(__dirname, '/ResetPassword.html'));
});
exports.resetPasswordPage = resetPasswordPage;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.query);
    console.log(req.query.token);
    const user = yield User_1.User.getUserFromRandomToken(req.query.token);
    if (!user) {
        return res.status(404).send("User not found");
    }
    user.passwordHash = stringToHash(req.query.password);
    yield data_source_1.AppDataSource.manager.save(user);
    return res.status(200).send("Password reset");
});
exports.resetPassword = resetPassword;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.User.getUserFromEmail(req.query.email);
    if (!user) {
        return res.status(404).send("User not found");
    }
    if (user.passwordHash !== stringToHash(req.query.password))
        return res.status(403).send("Incorrect Password");
    yield data_source_1.AppDataSource.manager.remove(user);
    return res.status(200).send("User deleted");
});
exports.deleteUser = deleteUser;
function verifyUserFromToken(token) {
    return __awaiter(this, void 0, void 0, function* () {
        let user = yield User_1.User.getUserFromRandomToken(token);
        if (!user)
            return 403;
        if (!user.verified)
            return 403;
        else
            return 200;
    });
}
//# sourceMappingURL=user.controller.js.map