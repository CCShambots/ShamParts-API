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
exports.setPartType = exports.getPartTypes = exports.setDimensions = exports.unAssignUser = exports.assignUser = exports.fulfillRequest = exports.requestAdditional = exports.reportBreakage = exports.loadPartThumbnail = exports.getPart = void 0;
const data_source_1 = require("../data-source");
const Part_1 = require("../entity/Part");
const Onshape_1 = require("../util/Onshape");
const LogEntry_1 = require("../entity/LogEntry");
const User_1 = require("../entity/User");
const class_transformer_1 = require("class-transformer");
const config_json_1 = __importDefault(require("../../config.json"));
//TODO: Fix bug with loading images that aren't saved in that document
const getPart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    //Load the part object from the database with this id
    const loaded = yield Part_1.Part.getPartFromId(id);
    if (!loaded.logEntries) {
        loaded.logEntries = [];
        yield data_source_1.AppDataSource.manager.save(loaded);
    }
    //Send the part object to the client
    res.status(200).send((0, class_transformer_1.instanceToPlain)(loaded));
});
exports.getPart = getPart;
const loadPartThumbnail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    //Load the part object from the database with this id
    const loaded = yield Part_1.Part.getPartFromId(id);
    //Load the thumbnail from Onshape
    const thumbnail = yield Onshape_1.Onshape.getThumbnailForElement(loaded.onshape_document_id, loaded.onshape_wvm_id, loaded.onshape_wvm_type, loaded.onshape_element_id, loaded);
    if (thumbnail === "fail") {
        return res.status(500).send("Failed to load thumbnail");
    }
    loaded.thumbnail = thumbnail;
    yield data_source_1.AppDataSource.manager.save(loaded);
    //Send the thumbnail to the client
    res.status(200).send(loaded.thumbnail);
});
exports.loadPartThumbnail = loadPartThumbnail;
const reportBreakage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const quantity = req.query.quantity ? parseInt(req.query.quantity) : 1;
    const user = yield User_1.User.getUserFromRandomToken(req.headers.token);
    if (!user) {
        return res.status(404).send("User not found");
    }
    const id = req.params.id;
    //Load the part object from the database with this id
    const loaded = yield Part_1.Part.getPartFromId(id);
    if (loaded.quantityInStock < quantity)
        return res.status(400).send("You broke more parts than you have?");
    loaded.quantityInStock -= quantity;
    LogEntry_1.LogEntry.createLogEntry("break", quantity, "", user.name).addToPart(loaded);
    yield data_source_1.AppDataSource.manager.save(loaded);
    res.status(200).send((0, class_transformer_1.instanceToPlain)(loaded));
});
exports.reportBreakage = reportBreakage;
const requestAdditional = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const quantity = req.query.quantity ? parseInt(req.query.quantity) : 1;
    const user = yield User_1.User.getUserFromRandomToken(req.headers.token);
    if (!user) {
        return res.status(404).send("User not found");
    }
    const id = req.params.id;
    //Load the part object from the database with this id
    const loaded = yield Part_1.Part.getPartFromId(id);
    loaded.quantityRequested += quantity;
    LogEntry_1.LogEntry.createLogEntry("request", quantity, "", user.name).addToPart(loaded);
    yield data_source_1.AppDataSource.manager.save(loaded);
    res.status(200).send((0, class_transformer_1.instanceToPlain)(loaded));
});
exports.requestAdditional = requestAdditional;
const fulfillRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const quantity = req.query.quantity ? parseInt(req.query.quantity) : 1;
    const user = yield User_1.User.getUserFromRandomToken(req.headers.token);
    if (!user) {
        return res.status(404).send("User not found");
    }
    const id = req.params.id;
    //Load the part object from the database with this id
    const loaded = yield Part_1.Part.getPartFromId(id);
    loaded.quantityInStock += quantity;
    loaded.quantityRequested -= Math.max(quantity, 0);
    LogEntry_1.LogEntry.createLogEntry("fulfill", quantity, "", user.name).addToPart(loaded);
    yield data_source_1.AppDataSource.manager.save(loaded);
    res.status(200).send((0, class_transformer_1.instanceToPlain)(loaded));
});
exports.fulfillRequest = fulfillRequest;
const assignUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.User.getUserFromRandomToken(req.headers.token);
    if (!user) {
        return res.status(404).send("User not found");
    }
    //Load the user included in the query params
    const asignee = yield User_1.User.getUserFromEmail(req.body.email);
    if (!asignee)
        return res.status(404).send("Asignee not found");
    const id = req.params.id;
    //Load the part object from the database with this id
    const loaded = yield Part_1.Part.getPartFromId(id);
    LogEntry_1.LogEntry.createLogEntry("assign", -1, asignee.name, user.name).addToPart(loaded);
    loaded.setAsignee(asignee);
    yield data_source_1.AppDataSource.manager.save(loaded);
    res.status(200).send((0, class_transformer_1.instanceToPlain)(loaded));
});
exports.assignUser = assignUser;
const unAssignUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.User.getUserFromRandomToken(req.headers.token);
    if (!user) {
        return res.status(404).send("User not found");
    }
    const id = req.params.id;
    //Load the part object from the database with this id
    const loaded = yield Part_1.Part.getPartFromId(id);
    LogEntry_1.LogEntry.createLogEntry("assign", -1, loaded.asigneeName, user.name).addToPart(loaded);
    loaded.asigneeName = "";
    loaded.asigneeId = -1;
    yield data_source_1.AppDataSource.manager.save(loaded);
    res.status(200).send((0, class_transformer_1.instanceToPlain)(loaded));
});
exports.unAssignUser = unAssignUser;
const setDimensions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.User.getUserFromRandomToken(req.headers.token);
    if (!user) {
        return res.status(404).send("User not found");
    }
    const id = req.params.id;
    //Load the part object from the database with this id
    const loaded = yield Part_1.Part.getPartFromId(id);
    //Make sure each dimension is to exactly one decimal place
    let d1 = parseFloat(req.body.d1).toFixed(1);
    let d2 = parseFloat(req.body.d2).toFixed(1);
    let d3 = parseFloat(req.body.d3).toFixed(1);
    //Check for Nans and reutrn an error if they are found
    if (d1 === "NaN" || d2 === "NaN" || d3 === "NaN") {
        return res.status(400).send("Invalid dimensions");
    }
    loaded.dimension1 = d1;
    loaded.dimension2 = d2;
    loaded.dimension3 = d3;
    //Log entry
    LogEntry_1.LogEntry.createLogEntry("dimensionChange", -1, `${d1} x ${d2} x ${d3}`, user.name).addToPart(loaded);
    yield data_source_1.AppDataSource.manager.save(loaded);
    res.status(200).send((0, class_transformer_1.instanceToPlain)(loaded));
});
exports.setDimensions = setDimensions;
const getPartTypes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(200).send(config_json_1.default.part_types);
});
exports.getPartTypes = getPartTypes;
const setPartType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.User.getUserFromRandomToken(req.headers.token);
    if (!user) {
        return res.status(404).send("User not found");
    }
    const id = req.params.id;
    //Load the part object from the database with this id
    const loaded = yield Part_1.Part.getPartFromId(id);
    //Make sure the part type is valid
    if (!config_json_1.default.part_types.includes(req.body.partType)) {
        return res.status(400).send("Invalid part type");
    }
    loaded.partType = req.body.partType;
    //Log entry
    LogEntry_1.LogEntry.createLogEntry("typeChange", -1, req.body.partType, user.name).addToPart(loaded);
    yield data_source_1.AppDataSource.manager.save(loaded);
    return res.status(200).send((0, class_transformer_1.instanceToPlain)(loaded));
});
exports.setPartType = setPartType;
//# sourceMappingURL=part.controller.js.map