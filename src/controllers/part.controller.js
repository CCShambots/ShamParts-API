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
exports.setPartType = exports.getPartTypes = exports.setDimensions = exports.updateCamInstructions = exports.camDone = exports.unAssignUser = exports.assignUser = exports.mergeWithOthers = exports.fulfillRequest = exports.requestAdditional = exports.reportBreakage = exports.loadPartThumbnail = exports.getPart = void 0;
const data_source_1 = require("../data-source");
const Part_1 = require("../entity/Part");
const Onshape_1 = require("../util/Onshape");
const LogEntry_1 = require("../entity/LogEntry");
const User_1 = require("../entity/User");
const class_transformer_1 = require("class-transformer");
const config_json_1 = __importDefault(require("../../config.json"));
const PartCombine_1 = require("../entity/PartCombine");
const NotificationUtil_1 = require("../notifications/NotificationUtil");
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
    const user = yield User_1.User.getUserFromRandomToken(req.headers.token);
    if (!user) {
        return res.status(404).send("User not found");
    }
    const id = req.params.id;
    //Load the part object from the database with this id
    const loaded = yield Part_1.Part.getPartFromId(id);
    if (!loaded.project.userHasAccess(user)) {
        return res.status(403).send("You do not have access to this part");
    }
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
    if (!loaded.project.userCanWrite(user)) {
        return res.status(403).send("You do not have write access to this part");
    }
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
    if (!loaded.project.userCanWrite(user)) {
        return res.status(403).send("You do not have write access to this part");
    }
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
    if (!loaded.project.userCanWrite(user)) {
        return res.status(403).send("You do not have write access to this part");
    }
    loaded.quantityInStock += quantity;
    loaded.quantityRequested -= quantity;
    //Make sure the quantity requested is not negative
    loaded.quantityRequested = Math.max(loaded.quantityRequested, 0);
    LogEntry_1.LogEntry.createLogEntry("fulfill", quantity, "", user.name).addToPart(loaded);
    yield data_source_1.AppDataSource.manager.save(loaded);
    res.status(200).send((0, class_transformer_1.instanceToPlain)(loaded));
});
exports.fulfillRequest = fulfillRequest;
const mergeWithOthers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.User.getUserFromRandomToken(req.headers.token);
    if (!user) {
        return res.status(404).send("User not found");
    }
    const id = parseInt(req.params.id);
    //Load the part object from the database with this id
    const loaded = yield Part_1.Part.getPartFromId(id);
    if (!loaded) {
        return res.status(404).send("Part not found");
    }
    if (!loaded.project.userCanWrite(user)) {
        return res.status(403).send("You do not have write access to this part");
    }
    if (!loaded.part_combines) {
        loaded.part_combines = [];
    }
    //Load the parts to merge with
    const partsToMerge = req.body.parts;
    //Make sure the parts to merge with are valid
    for (let partId of partsToMerge) {
        let thisPart = yield Part_1.Part.getPartFromId(partId.toString());
        if (!thisPart) {
            return res.status(404).send(`Part not found: ${partId}`);
        }
        if (partId === id) {
            return res.status(400).send("Cannot merge a part with itself");
        }
        if (loaded.quantityNeeded !== thisPart.quantityNeeded) {
            return res.status(400).send("Parts must have the same quantity needed to be merged");
        }
        let combine = new PartCombine_1.PartCombine();
        combine.parent_part = loaded;
        combine.parent_id = loaded.id;
        combine.onshape_element_id = thisPart.onshape_element_id;
        combine.onshape_part_id = thisPart.onshape_part_id;
        combine.onshape_document_id = thisPart.onshape_document_id;
        combine.onshape_wvm_id = thisPart.onshape_wvm_id;
        combine.onshape_wvm_type = thisPart.onshape_wvm_type;
        loaded.part_combines.push(combine);
        //Remove old part from database
        yield data_source_1.AppDataSource.manager.remove(thisPart);
    }
    //Save the compound object
    yield data_source_1.AppDataSource.manager.save(loaded);
    //Log entry
    LogEntry_1.LogEntry.createLogEntry("merge", -1, partsToMerge.join(", "), user.name).addToPart(loaded);
    res.status(200).send((0, class_transformer_1.instanceToPlain)(loaded));
});
exports.mergeWithOthers = mergeWithOthers;
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
    if (!loaded.project.userCanWrite(user)) {
        return res.status(403).send("You do not have write access to this part");
    }
    LogEntry_1.LogEntry.createLogEntry("assign", -1, asignee.name, user.name).addToPart(loaded);
    loaded.setAsignee(asignee);
    (0, NotificationUtil_1.sendNotification)(asignee.firebase_tokens, "Part Assigned", `You have been assigned part ${loaded.number}`);
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
    if (!loaded.project.userCanWrite(user)) {
        return res.status(403).send("You do not have write access to this part");
    }
    LogEntry_1.LogEntry.createLogEntry("assign", -1, loaded.asigneeName, user.name).addToPart(loaded);
    loaded.asigneeName = "";
    loaded.asigneeId = -1;
    yield data_source_1.AppDataSource.manager.save(loaded);
    res.status(200).send((0, class_transformer_1.instanceToPlain)(loaded));
});
exports.unAssignUser = unAssignUser;
const camDone = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.User.getUserFromRandomToken(req.headers.token);
    if (!user) {
        return res.status(404).send("User not found");
    }
    const id = req.params.id;
    //Load the part object from the database with this id
    const loaded = yield Part_1.Part.getPartFromId(id);
    if (!loaded.project.userCanWrite(user)) {
        return res.status(403).send("You do not have write access to this part");
    }
    loaded.camDone = req.body.done;
    //Generate a log entry
    LogEntry_1.LogEntry.createLogEntry("camUpload", -1, "CAM Done: " + req.body.done, user.name).addToPart(loaded);
    yield data_source_1.AppDataSource.manager.save(loaded);
    res.status(200).send((0, class_transformer_1.instanceToPlain)(loaded));
});
exports.camDone = camDone;
const updateCamInstructions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.User.getUserFromRandomToken(req.headers.token);
    if (!user) {
        return res.status(404).send("User not found");
    }
    const id = req.params.id;
    //Load the part object from the database with this id
    const loaded = yield Part_1.Part.getPartFromId(id);
    if (!loaded.project.userCanWrite(user)) {
        return res.status(403).send("You do not have write access to this part");
    }
    loaded.camInstructions = req.body.instructions;
    //Generate a log entry
    LogEntry_1.LogEntry.createLogEntry("camChange", -1, "CAM Instructions", user.name).addToPart(loaded);
    yield data_source_1.AppDataSource.manager.save(loaded);
    res.status(200).send((0, class_transformer_1.instanceToPlain)(loaded));
});
exports.updateCamInstructions = updateCamInstructions;
const setDimensions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.User.getUserFromRandomToken(req.headers.token);
    if (!user) {
        return res.status(404).send("User not found");
    }
    const id = req.params.id;
    //Load the part object from the database with this id
    const loaded = yield Part_1.Part.getPartFromId(id);
    if (!loaded.project.userCanWrite(user)) {
        return res.status(403).send("You do not have write access to this part");
    }
    //Make sure each dimension is to exactly one decimal place
    let d1 = parseFloat(req.body.d1).toFixed(3);
    let d2 = parseFloat(req.body.d2).toFixed(3);
    let d3 = parseFloat(req.body.d3).toFixed(3);
    //Check for Nans and reutrn an error if they are found
    if (d1 === "NaN" || d2 === "NaN" || d3 === "NaN") {
        return res.status(400).send("Invalid dimensions");
    }
    loaded.dimension1 = d1;
    loaded.dimension2 = d2;
    loaded.dimension3 = d3;
    loaded.dimensionsOverride = true;
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
    if (!loaded.project.userCanWrite(user)) {
        return res.status(403).send("You do not have write access to this part");
    }
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