import express from "express";
import onshape from "./onshape";
import project from "./project";
import part from "./part";
import user from "./user";
import server from "./server";

const router = express.Router();
router.use('/onshape', onshape)
router.use('/project', project)
router.use('/part', part)
router.use('/user', user)
router.use("/server", server)

export default router