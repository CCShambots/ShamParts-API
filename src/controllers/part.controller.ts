import {Request, Response} from "express";
import {AppDataSource} from "../data-source";
import {Part} from "../entity/Part";
import {Onshape} from "../util/Onshape";
import {LogEntry} from "../entity/LogEntry";
import {User} from "../entity/User";
import {instanceToPlain} from "class-transformer";
import configJson from "../../config.json";


//TODO: Fix bug with loading images that aren't saved in that document

export const getPart = async (req:Request, res:Response) => {

    const id = req.params.id;

    //Load the part object from the database with this id
    const loaded = await Part.getPartFromId(id);

    if(!loaded.logEntries) {
        loaded.logEntries = [];

        await AppDataSource.manager.save(loaded);
    }

    //Send the part object to the client
    res.status(200).send(instanceToPlain(loaded));
}


export const loadPartThumbnail = async (req:Request, res:Response) => {
    const id = req.params.id;

    //Load the part object from the database with this id
    const loaded = await Part.getPartFromId(id);

    //Load the thumbnail from Onshape
    const thumbnail = await Onshape.getThumbnailForElement(
        loaded.onshape_document_id,
        loaded.onshape_wvm_id,
        loaded.onshape_wvm_type,
        loaded.onshape_element_id,
        loaded
    )

    if(thumbnail === "fail") {
        return res.status(500).send("Failed to load thumbnail");
    }

    loaded.thumbnail = thumbnail

    await AppDataSource.manager.save(loaded);

    //Send the thumbnail to the client
    res.status(200).send(loaded.thumbnail);

}

export const reportBreakage = async (req:Request, res:Response) => {
    const quantity = req.query.quantity ? parseInt(req.query.quantity as string) : 1;

    const user = await User.getUserFromRandomToken(req.headers.token as string)

    if(!user) {
        return res.status(404).send("User not found");
    }

    const id = req.params.id;

    //Load the part object from the database with this id
    const loaded = await Part.getPartFromId(id);

    if(loaded.quantityInStock < quantity)
        return res.status(400).send("You broke more parts than you have?");

    loaded.quantityInStock -= quantity;

    LogEntry.createLogEntry("break", quantity, "", user.name).addToPart(loaded)

    await AppDataSource.manager.save(loaded);

    res.status(200).send(instanceToPlain(loaded));
}

export const requestAdditional = async (req:Request, res:Response) => {
    const quantity = req.query.quantity ? parseInt(req.query.quantity as string) : 1;

    const user = await User.getUserFromRandomToken(req.headers.token as string)

    if(!user) {
        return res.status(404).send("User not found");
    }

    const id = req.params.id;

    //Load the part object from the database with this id
    const loaded = await Part.getPartFromId(id);

    loaded.quantityRequested += quantity;

    LogEntry.createLogEntry("request", quantity, "", user.name).addToPart(loaded)

    await AppDataSource.manager.save(loaded);

    res.status(200).send(instanceToPlain(loaded));
}

export const fulfillRequest = async (req:Request, res:Response) => {
    const quantity = req.query.quantity ? parseInt(req.query.quantity as string) : 1;

    const user = await User.getUserFromRandomToken(req.headers.token as string)

    if(!user) {
        return res.status(404).send("User not found");
    }

    const id = req.params.id;

    //Load the part object from the database with this id
    const loaded = await Part.getPartFromId(id);

    loaded.quantityInStock += quantity;
    loaded.quantityRequested -= Math.max(quantity, 0);

    LogEntry.createLogEntry("fulfill", quantity, "", user.name).addToPart(loaded)

    await AppDataSource.manager.save(loaded);

    res.status(200).send(instanceToPlain(loaded));
}

export const assignUser = async (req:Request, res:Response) => {
    const user = await User.getUserFromRandomToken(req.headers.token as string)

    if(!user) {
        return res.status(404).send("User not found");
    }

    //Load the user included in the query params
    const asignee = await User.getUserFromEmail(req.body.email as string);

    if(!asignee) return res.status(404).send("Asignee not found");

    const id = req.params.id;

    //Load the part object from the database with this id
    const loaded = await Part.getPartFromId(id);

    LogEntry.createLogEntry("assign", -1, asignee.name, user.name).addToPart(loaded);

    loaded.setAsignee(asignee);

    await AppDataSource.manager.save(loaded);

    res.status(200).send(instanceToPlain(loaded));
}

export const unAssignUser = async (req:Request, res:Response) => {
    const user = await User.getUserFromRandomToken(req.headers.token as string)

    if(!user) {
        return res.status(404).send("User not found");
    }

    const id = req.params.id;

    //Load the part object from the database with this id
    const loaded = await Part.getPartFromId(id);

    LogEntry.createLogEntry("assign", -1, loaded.asigneeName, user.name).addToPart(loaded);

    loaded.asigneeName = ""
    loaded.asigneeId = -1

    await AppDataSource.manager.save(loaded);

    res.status(200).send(instanceToPlain(loaded));
}

export const setDimensions = async (req:Request, res:Response) => {
    const user = await User.getUserFromRandomToken(req.headers.token as string)

    if(!user) {
        return res.status(404).send("User not found");
    }

    const id = req.params.id;

    //Load the part object from the database with this id
    const loaded = await Part.getPartFromId(id);

    //Make sure each dimension is to exactly one decimal place
    let d1 = parseFloat(req.body.d1).toFixed(1);
    let d2 = parseFloat(req.body.d2).toFixed(1);
    let d3 = parseFloat(req.body.d3).toFixed(1);

    //Check for Nans and reutrn an error if they are found
    if(d1 === "NaN" || d2 === "NaN" || d3 === "NaN") {
        return res.status(400).send("Invalid dimensions");
    }

    loaded.dimension1 = d1;
    loaded.dimension2 = d2;
    loaded.dimension3 = d3;

    //Log entry
    LogEntry.createLogEntry("dimensionChange", -1, `${d1} x ${d2} x ${d3}`, user.name).addToPart(loaded);

    await AppDataSource.manager.save(loaded);

    res.status(200).send(instanceToPlain(loaded));
}

export const getPartTypes = async (req:Request, res:Response) => {
    return res.status(200).send(configJson.part_types)
}

export const setPartType = async (req:Request, res:Response) => {
    const user = await User.getUserFromRandomToken(req.headers.token as string)

    if(!user) {
        return res.status(404).send("User not found");
    }

    const id = req.params.id;

    //Load the part object from the database with this id
    const loaded = await Part.getPartFromId(id);

    //Make sure the part type is valid
    if(!configJson.part_types.includes(req.body.partType)) {
        return res.status(400).send("Invalid part type");
    }

    loaded.partType = req.body.partType;

    //Log entry
    LogEntry.createLogEntry("typeChange", -1, req.body.partType, user.name).addToPart(loaded);

    await AppDataSource.manager.save(loaded);

    return res.status(200).send(instanceToPlain(loaded));
}