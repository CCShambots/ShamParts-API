import {Request, Response} from "express";
import {AppDataSource} from "../data-source";
import {Part} from "../entity/Part";
import {Onshape} from "../util/Onshape";

//TODO: Fix bug with loading images that aren't saved in that document

export const getPart = async (req:Request, res:Response) => {

    const id = req.params.id;

    //Load the part object from the database with this id
    const loaded = await AppDataSource.createQueryBuilder(Part, "part")
        .innerJoinAndSelect("part.project", "project")
        .where("part.id = :id", {id: id})
        .getOne();

    //Send the part object to the client
    res.status(200).send(loaded);
}


export const loadPartThumbnail = async (req:Request, res:Response) => {
    const id = req.params.id;

    //Load the part object from the database with this id
    const loaded = await AppDataSource.createQueryBuilder(Part, "part")
        .innerJoinAndSelect("part.project", "project")
        .where("part.id = :id", {id: id})
        .getOne();
    
    //Load the thumbnail from Onshape
    const thumbnail = await Onshape.getThumbnailForElement(
        loaded.project.onshape_id,
        loaded.project.default_workspace,
        loaded.onshape_id,
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

    const id = req.params.id;

    //Load the part object from the database with this id
    const loaded = await AppDataSource.createQueryBuilder(Part, "part")
        .innerJoinAndSelect("part.project", "project")
        .where("part.id = :id", {id: id})
        .getOne();

    if(loaded.quantityInStock < quantity)
        return res.status(400).send("You broke more parts than you have?");

    loaded.quantityInStock -= quantity;

    await AppDataSource.manager.save(loaded);

    res.status(200).send(loaded);
}

export const requestAdditional = async (req:Request, res:Response) => {
    const quantity = req.query.quantity ? parseInt(req.query.quantity as string) : 1;

    const id = req.params.id;

    //Load the part object from the database with this id
    const loaded = await AppDataSource.createQueryBuilder(Part, "part")
        .innerJoinAndSelect("part.project", "project")
        .where("part.id = :id", {id: id})
        .getOne();

    loaded.quantityRequested += quantity;

    await AppDataSource.manager.save(loaded);

    res.status(200).send(loaded);
}

export const fulfillRequest = async (req:Request, res:Response) => {
    const quantity = req.query.quantity ? parseInt(req.query.quantity as string) : 1;

    const id = req.params.id;

    //Load the part object from the database with this id
    const loaded = await AppDataSource.createQueryBuilder(Part, "part")
        .innerJoinAndSelect("part.project", "project")
        .where("part.id = :id", {id: id})
        .getOne();

    loaded.quantityInStock += quantity;
    loaded.quantityRequested -= Math.max(quantity, 0);

    await AppDataSource.manager.save(loaded);

    res.status(200).send(loaded);
}