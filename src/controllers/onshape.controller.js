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
exports.getOnshapeKey = exports.getAssemblies = exports.getDocuments = void 0;
const Onshape_1 = require("../util/Onshape");
const config_json_1 = __importDefault(require("../../config.json"));
const User_1 = require("../entity/User");
const getDocuments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let result = yield Onshape_1.Onshape.getDocuments(req.query.query);
    return res.send(result);
});
exports.getDocuments = getDocuments;
const getAssemblies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let result = yield Onshape_1.Onshape.getAssemblies(req.query.did, req.query.wid);
    return res.send(result);
});
exports.getAssemblies = getAssemblies;
const getOnshapeKey = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //Make sure the user is verified by instantiating the user and checking the verified field
    const user = yield User_1.User.getUserFromRandomToken(req.headers.token);
    if (!user) {
        return res.status(404).send("User not found");
    }
    if (!user.verified) {
        return res.status(403).send("User not verified");
    }
    return res.send(config_json_1.default.onshape_auth_code);
});
exports.getOnshapeKey = getOnshapeKey;
//# sourceMappingURL=onshape.controller.js.map