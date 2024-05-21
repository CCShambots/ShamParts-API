
import {Request, Response} from "express";
import {User} from "../entity/User";
import {Project} from "../entity/Project";
import {Compound} from "../entity/Compound";

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

    compound.material = req.body.material;
    compound.thickness = req.body.thickness;


    compound.parts = req.body.parts;



}