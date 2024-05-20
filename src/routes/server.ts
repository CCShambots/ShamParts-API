import express from "express";
import {addFollowerServer, deleteServer, denyServer, getServers, verifyServer} from "../controllers/server.controller";

const router = express.Router();

router.get("/list", getServers)

router.post("/add", addFollowerServer)

router.get("/verity", verifyServer)
router.get("/deny", denyServer)
router.delete("/delete", deleteServer)

export default router