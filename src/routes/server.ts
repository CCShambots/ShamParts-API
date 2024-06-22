import express from "express";
import {
    addFollowerServer,
    checkForValidServer,
    deleteServer,
    denyServer, getServer,
    getServers,
    verifyServer
} from "../controllers/server.controller";

const router = express.Router();

router.get("/list", getServers)
router.get("/", getServer);

router.post("/add", addFollowerServer)

router.get("/verify", verifyServer)
router.get("/check", checkForValidServer)
router.get("/deny", denyServer)
router.delete("/delete", deleteServer)

export default router