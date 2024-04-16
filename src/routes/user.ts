import express from "express";
import {
    cancelUser,
    createUser,
    deleteUser,
    forgotPassword,
    getUser,
    getUsers,
    resetPassword,
    resetPasswordPage,
    authenticateUser,
    verifyUser, getUserFromToken
} from "../controllers/user.controller";


const router = express.Router();

router.get("/", getUser)
router.get("/fromToken", getUserFromToken)
router.post("/create", createUser)
router.get("/verify", verifyUser)
router.get("/authenticate", authenticateUser)
router.get("/cancel", cancelUser)
router.get("/users", getUsers)
router.patch("/forgot", forgotPassword)
router.post("/resetPassword", resetPassword)
router.get("/resetPasswordPage", resetPasswordPage)
router.delete("/delete", deleteUser)

export default router