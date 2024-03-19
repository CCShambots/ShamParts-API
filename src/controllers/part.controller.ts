import {Request, Response} from "express";
import {AppDataSource} from "../data-source";
import {Part} from "../entity/Part";
import {Onshape} from "../util/Onshape";

export const loadPartThumbnail = async (req:Request, res:Response) => {
    const id = req.params.id;

    //Load the part object from the database with this id
    const loaded = await AppDataSource.createQueryBuilder(Part, "part")
        .innerJoinAndSelect("part.project", "project")
        .where("part.id = :id", {id: id})
        .getOne();
    
    //Load the thumbnail from Onshape
    loaded.thumbnail = await Onshape.getThumbnailForElement(
        loaded.project.onshape_id,
        loaded.project.default_workspace,
        loaded.onshape_id)

    await AppDataSource.manager.save(loaded);

    //Send the thumbnail to the client
    res.status(200).send(loaded.thumbnail);

}