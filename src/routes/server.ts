import express from "express";
import {addFollowerServer, getServers} from "../controllers/server.controller";

const router = express.Router();

router.get("/list", getServers)

router.post("/add", addFollowerServer)

export default router