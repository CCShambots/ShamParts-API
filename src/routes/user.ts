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
    verifyUser, getUserFromToken, changeUserName, addUserRole, removeUserRole, getRoles, setUserRoles
} from "../controllers/user.controller";


const router = express.Router();

router.get("/", getUser)
router.get("/fromToken", getUserFromToken)

router.get('roles', getRoles)
router.post("/addRole", addUserRole)
router.delete("/removeRole", removeUserRole)
router.patch("/setRoles", setUserRoles)

router.post("/create", createUser)
router.get("/verify", verifyUser)
router.get("/authenticate", authenticateUser)
router.get("/cancel", cancelUser)
router.get("/users", getUsers)

router.patch("/changeName", changeUserName)
router.patch("/forgot", forgotPassword)
router.post("/resetPassword", resetPassword)
router.get("/resetPasswordPage", resetPasswordPage)
router.delete("/delete", deleteUser)

export default router