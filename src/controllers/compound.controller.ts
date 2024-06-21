
import {Request, Response} from "express";
import {User} from "../entity/User";
import {Project} from "../entity/Project";
import {Compound} from "../entity/Compound";
import {AppDataSource} from "../data-source";
import {CompoundPart} from "../entity/CompoundPart";
import {instanceToPlain} from "class-transformer";
import {Part} from "../entity/Part";
import {LogEntry} from "../entity/LogEntry";

export const createCompound = async (req:Request, res:Response) => {
    //Check user is correct
    //Check if user is involved in this project
    const user = await User.getUserFromRandomToken(req.headers.token as string)

    if (!user) {
        return res.status(404).send("User not found");
    }

    const project = await Project.loadProject(req.body.projectName)

    if (!project) {
        return res.status(404).send("Project not found");
    }

    if (!project.userCanWrite(user)) {
        return res.status(403).send("You do not have write access to this project");
    }

    //Check if this compound already exists
    if(project.compounds.filter(e => e.name === req.body.name).length > 0) {
        return res.status(400).send("This compound name already exists");
    }

    const compound = new Compound();
    compound.name = req.body.name;
    compound.project = project;
    project.compounds.push(compound);

    compound.material = req.body.material;
    compound.thickness = req.body.thickness;

    compound.parts = req.body.parts.map((e) => {
        const part = new CompoundPart()
        part.compound = compound;
        part.part_id = e.partId;
        part.quantity = e.quantity;

        return part;
    });

    compound.thumbnail = "";

    compound.camDone = false;
    compound.camInstructions = [];

    compound.logEntries = [];

    //save the project
    await AppDataSource.manager.save(project);

    res.status(200).send(instanceToPlain(compound));

}

export const updateCompound = async (req:Request, res:Response) => {
    //Check user is correct
    //Check if user is involved in this project
    const user = await User.getUserFromRandomToken(req.headers.token as string)

    if (!user) {
        return res.status(404).send("User not found");
    }

    const project = await Project.loadProject(req.body.projectName)

    if (!project) {
        return res.status(404).send("Project not found");
    }

    if (!project.userCanWrite(user)) {
        return res.status(403).send("You do not have write access to this project");
    }

    const id = req.params.id;

    //Load the part object from the database with this id
    const loaded = await Compound.getCompoundFromId(id);

    loaded.name = req.body.name;
    loaded.material = req.body.material;
    loaded.thickness = req.body.thickness;

    loaded.parts = req.body.parts.map((e) => {
        const part = new CompoundPart()
        part.compound = loaded;
        part.part_id = e.partId;
        part.quantity = e.quantity;

        return part;
    });

    //save the project
    await AppDataSource.manager.save(loaded);

    res.status(200).send(instanceToPlain(loaded));


}

export const updateDimensions = async (req:Request, res:Response) => {

    const id = req.params.id;

    //Load the part object from the database with this id
    const loaded = await Compound.getCompoundFromId(id);

    loaded.xDimension = req.body.xDimension;
    loaded.yDimension = req.body.yDimension;

    LogEntry.createLogEntry("dimensionChange", -1, "X: " + req.body.xDimension + " Y: " + req.body.yDimension, "System").addToCompound(loaded);

    //save the project
    await AppDataSource.manager.save(loaded);

    res.status(200).send(instanceToPlain(loaded));


}

export const getThumbnail = async (req:Request, res:Response) => {
    const id = req.params.id;

    //Load the part object from the database with this id
    const loaded = await Compound.getCompoundFromId(id);

    res.status(200).send(loaded.thumbnail);

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
    const loaded = await Compound.getCompoundFromId(id);

    LogEntry.createLogEntry("assign", -1, asignee.name, user.name).addToCompound(loaded);

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

export const uploadImage = async (req:Request, res:Response) => {
    const user = await User.getUserFromRandomToken(req.headers.token as string)

    if(!user) {
        return res.status(404).send("User not found");
    }

    const id = req.params.id;

    //Load the part object from the database with this id
    const loaded = await Compound.getCompoundFromId(id);

    loaded.thumbnail = req.body.image;

    await AppDataSource.manager.save(loaded);

    res.status(200).send(instanceToPlain(loaded));
}

export const camDone = async (req:Request, res:Response) => {
    const user = await User.getUserFromRandomToken(req.headers.token as string)

    if(!user) {
        return res.status(404).send("User not found");
    }

    const id = req.params.id;

    //Load the part object from the database with this id
    const loaded = await Compound.getCompoundFromId(id);

    loaded.camDone = req.body.done;

    //Generate a log entry
    LogEntry.createLogEntry("camUpload", -1, "CAM Done: " + req.body.done, user.name).addToCompound(loaded);

    await AppDataSource.manager.save(loaded);

    res.status(200).send(instanceToPlain(loaded));
}

export const updateCamInstructions = async (req:Request, res:Response) => {
    const user = await User.getUserFromRandomToken(req.headers.token as string)

    if(!user) {
        return res.status(404).send("User not found");
    }

    const id = req.params.id;

    //Load the part object from the database with this id
    const loaded = await Compound.getCompoundFromId(id);

    loaded.camInstructions = req.body.instructions;

    //Generate a log entry
    LogEntry.createLogEntry("camChange", -1, "CAM Instructions", user.name).addToCompound(loaded);

    await AppDataSource.manager.save(loaded);

    res.status(200).send(instanceToPlain(loaded));

}

export const fulfillCompound = async (req:Request, res:Response) => {
    const user = await User.getUserFromRandomToken(req.headers.token as string)

    if(!user) {
        return res.status(404).send("User not found");
    }

    const id = req.params.id;

    //Load the part object from the database with this id
    const loaded = await Compound.getCompoundFromId(id);

    //Remove the asignee
    loaded.asigneeName = ""
    loaded.asigneeId = -1

    //Generate a log entry
    LogEntry.createLogEntry("fulfill", 1, "Fulfilled", user.name).addToCompound(loaded);

    //Load all the parts in this compound and fulfill them in the correct quantities
    for(let part of loaded.parts) {
        const partLoaded = await Part.getPartFromId(part.part_id);
        partLoaded.quantityInStock += part.quantity;
        await AppDataSource.manager.save(partLoaded);
    }

    await AppDataSource.manager.save(loaded);

    res.status(200).send(instanceToPlain(loaded));
}

export const decrementPart = async (req:Request, res:Response) => {
    const user = await User.getUserFromRandomToken(req.headers.token as string)

    if(!user) {
        return res.status(404).send("User not found");
    }

    const id = req.params.id;

    //Load the part object from the database with this id
    const loaded = await Compound.getCompoundFromId(id);

    //Load all the parts in this compound and fulfill them in the correct quantities
    for(let part of loaded.parts) {
        if(part.part_id == req.body.id) {
            part.quantity -= 1;

            if(part.quantity <= 0) {
                loaded.parts.filter(e => e.id !== part.id)
            }
        }
    }

    await AppDataSource.manager.save(loaded);

    res.status(200).send(instanceToPlain(loaded));
}

export const incrementPart = async (req:Request, res:Response) => {
    const user = await User.getUserFromRandomToken(req.headers.token as string)

    if(!user) {
        return res.status(404).send("User not found");
    }

    const id = req.params.id;

    //Load the part object from the database with this id
    const loaded = await Compound.getCompoundFromId(id);

    //Load all the parts in this compound and fulfill them in the correct quantities
    for(let part of loaded.parts) {
        if(part.part_id == req.body.id) {
            part.quantity += 1;
        }
    }

    await AppDataSource.manager.save(loaded);

    res.status(200).send(instanceToPlain(loaded));
}

export const deleteCompound = async (req:Request, res:Response) => {
    const user = await User.getUserFromRandomToken(req.headers.token as string)

    if(!user) {
        return res.status(404).send("User not found");
    }

    const id = req.params.id;

    //Load the part object from the database with this id
    const loaded = await Compound.getCompoundFromId(id);

    await AppDataSource.manager.remove(loaded);

    res.status(200).send(instanceToPlain(loaded));
}