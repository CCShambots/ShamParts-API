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
exports.deleteUser = exports.resetPassword = exports.resetPasswordPage = exports.resetPasswordEmail = exports.forgotPassword = exports.changeUserName = exports.getUserFromToken = exports.getUser = exports.getUsers = exports.removeUserRole = exports.setUserRoles = exports.addUserRole = exports.cancelUser = exports.logOutUser = exports.authenticateUser = exports.verifyUser = exports.sendVerificationEndpoint = exports.createUser = exports.sendNotif = exports.getRoles = void 0;
const data_source_1 = require("../data-source");
const User_1 = require("../entity/User");
const Mailjet_1 = require("../util/Mailjet");
const class_transformer_1 = require("class-transformer");
const config_json_1 = __importDefault(require("../../config.json"));
const path_1 = __importDefault(require("path"));
const AuthUtil_1 = require("../util/AuthUtil");
const index_1 = require("../index");
const Server_1 = require("../entity/Server");
const Project_1 = require("../entity/Project");
const getRoles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(200).send(config_json_1.default.roles);
});
exports.getRoles = getRoles;
//Called from any servers to the main central server to notify users
const sendNotif = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const server = yield data_source_1.AppDataSource.manager.findOne(Server_1.Server, { where: { random_token: req.body.server_token } });
    if (server === null) {
        return res.status(404).send("Server not found");
    }
    let message = {
        tokens: req.body.firebase_tokens,
        notification: {
            title: req.body.title,
            body: req.body.body
        }
    };
    try {
        const response = yield index_1.firebase.messaging().sendEachForMulticast(message);
        console.log("Message result:", response);
    }
    catch (_a) {
        return res.status(500).send("Error sending notification");
    }
    return res.status(200).send("Sent Notification Successfully");
});
exports.sendNotif = sendNotif;
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
    //Generate random token for verification, will automatically ensure it doesn't duplicate
    user.randomToken = (0, AuthUtil_1.generateSafeRandomToken)(users.map(e => e.randomToken));
    user.passwordHash = (0, AuthUtil_1.stringToHash)(queryParams.password);
    user.firebase_tokens = [];
    if (req.query.firebase_token !== "none") {
        user.firebase_tokens.push(queryParams.firebase_token);
    }
    //Send verification email to the user
    let responseStatus = yield (0, Mailjet_1.sendVerificationEmail)(user.email, user.name, user.randomToken);
    console.log(responseStatus);
    yield data_source_1.AppDataSource.manager.save(user);
    const userPlain = (0, class_transformer_1.instanceToPlain)(user);
    return res.status(200).send(userPlain);
});
exports.createUser = createUser;
const sendVerificationEndpoint = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.User.getUserFromEmail(req.query.email);
    if (!user) {
        return res.status(404).send("User not found");
    }
    let responseStatus = yield (0, Mailjet_1.sendVerificationEmail)(user.email, user.name, user.randomToken);
    return res.status(200).send("Email sent");
});
exports.sendVerificationEndpoint = sendVerificationEndpoint;
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
    if (user.passwordHash !== (0, AuthUtil_1.stringToHash)(req.query.password))
        return res.status(403).send("Invalid token");
    if (!user.verified)
        return res.status(403).send("User not verified");
    if (user.firebase_tokens == null) {
        user.firebase_tokens = [];
    }
    if (!user.firebase_tokens.includes(req.query.firebase_token) && req.query.firebase_token !== "none") {
        user.firebase_tokens.push(req.query.firebase_token);
    }
    yield data_source_1.AppDataSource.manager.save(user);
    return res.status(200).send(user);
});
exports.authenticateUser = authenticateUser;
const logOutUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.User.getUserFromRandomToken(req.query.token);
    if (!user) {
        //Return an error message (could not find user to verify)
        return res.status(404).send("User not found");
    }
    if (user.firebase_tokens != null) {
        user.firebase_tokens = user.firebase_tokens.filter(e => e !== req.query.firebase_token);
    }
    yield data_source_1.AppDataSource.manager.save(user);
    //Return a success message (user verified)
    return res.status(200).send("User logged out");
});
exports.logOutUser = logOutUser;
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
    //Prevent adding duplicate roles
    if (user.roles.includes(req.query.role))
        return res.status(400).send("User already has role");
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
    if (user.email === config_json_1.default.admin_user && removingRole === "admin")
        return res.status(403).send("Cannot de-admin the uber-admin");
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
    let users = yield data_source_1.AppDataSource.manager
        .createQueryBuilder(User_1.User, "user")
        .getMany();
    if (req.query.project) {
        let project = yield Project_1.Project.loadProject(req.query.project);
        users = users.filter(e => {
            return project.userHasAccess(e);
        });
    }
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
    if (req.query.name === "")
        return res.status(400).send("Name cannot be empty");
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
const resetPasswordEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.User.getUserFromEmail(req.body.email);
    if (!user) {
        return res.status(404).send("User not found");
    }
    let responseStatus = yield (0, Mailjet_1.sendPasswordResetEmail)(user.email, user.name, user.randomToken);
    console.log(responseStatus);
    return res.status(200).send("Email sent");
});
exports.resetPasswordEmail = resetPasswordEmail;
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
    user.passwordHash = (0, AuthUtil_1.stringToHash)(req.query.password);
    yield data_source_1.AppDataSource.manager.save(user);
    return res.status(200).send("Password reset");
});
exports.resetPassword = resetPassword;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userToDelete = yield User_1.User.getUserFromEmail(req.query.email);
    const userRequesting = yield User_1.User.getUserFromRandomToken(req.headers.token);
    if (!userToDelete) {
        return res.status(404).send("User not found");
    }
    else if (!userRequesting) {
        return res.status(404).send("Requesting user not found");
    }
    if (userRequesting.roles.includes("admin")) {
    }
    else {
        if (req.query.password) {
            if (userToDelete.passwordHash !== (0, AuthUtil_1.stringToHash)(req.query.password)) {
                return res.status(403).send("Incorrect Password");
            }
        }
        else if (userToDelete.randomToken !== req.query.token) {
            return res.status(403).send("Incorrect Password");
        }
        else if (userRequesting.id !== userToDelete.id) {
            return res.status(403).send("Unauthorized");
        }
    }
    yield data_source_1.AppDataSource.manager.remove(userToDelete);
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