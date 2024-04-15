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
exports.getUsers = exports.cancelUser = exports.verifyUser = exports.createUser = void 0;
const data_source_1 = require("../data-source");
const User_1 = require("../entity/User");
const Mailjet_1 = require("../util/Mailjet");
const class_transformer_1 = require("class-transformer");
const config_json_1 = __importDefault(require("../../config.json"));
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    user.randomToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    user.passwordHash = stringToHash(queryParams.password);
    //Send verification email to the user
    let responseStatus = yield (0, Mailjet_1.sendVerificationEmail)(user.email, user.name, user.randomToken);
    console.log(responseStatus);
    yield data_source_1.AppDataSource.manager.save(user);
    const userPlain = (0, class_transformer_1.instanceToPlain)(user);
    return res.status(200).send(userPlain);
});
exports.createUser = createUser;
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
const verifyUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield data_source_1.AppDataSource.manager
        .createQueryBuilder(User_1.User, "user")
        .where("user.randomToken = :token", { token: req.query.token })
        .getOne();
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
const cancelUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield data_source_1.AppDataSource.manager
        .createQueryBuilder(User_1.User, "user")
        .where("user.randomToken= :token", { token: req.query.token })
        .getOne();
    if (!user) {
        //Return an error message (could not find user to verify)
        return res.status(404).send("User not found");
    }
    yield data_source_1.AppDataSource.manager.remove(user);
    //Return a success message (user verified)
    return res.status(200).send("User removed");
});
exports.cancelUser = cancelUser;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield data_source_1.AppDataSource.manager
        .createQueryBuilder(User_1.User, "user")
        .getMany();
    const plainUsers = users.map(e => (0, class_transformer_1.instanceToPlain)(e));
    return res.status(200).send(plainUsers);
});
exports.getUsers = getUsers;
//# sourceMappingURL=user.controller.js.map