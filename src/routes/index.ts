import express from "express";
import onshape from "./onshape";
import project from "./project";
import part from "./part";
import user from "./user";
import server from "./server";
import compound from "./compound";

const router = express.Router();
router.use('/onshape', onshape)
router.use('/project', project)
router.use('/part', part)
router.use('/user', user)
router.use("/server", server)
router.use("/compound", compound)

router.get("/", (req, res) => {
    res.status(200).send("I'm alive!!!")
})

export default router