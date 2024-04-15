import express from "express";
import {cancelUser, createUser, getUser, getUsers, verifyUser} from "../controllers/user.controller";


const router = express.Router();

router.post("/create", createUser)
router.get("/verify", verifyUser)
router.get("/cancel", cancelUser)
router.get("/users", getUsers)
router.get("/", getUser)

export default router