import express from "express";
import test from "./test";
import onshape from "./onshape";

const router = express.Router();
router.use('/test', test)
router.use('/onshape', onshape)

export default router