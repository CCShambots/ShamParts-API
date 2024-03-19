import express from "express";
import test from "./test";
import onshape from "./onshape";
import project from "./project";
import part from "./part";

const router = express.Router();
router.use('/test', test)
router.use('/onshape', onshape)
router.use('/project', project)
router.use('/part', part)

export default router