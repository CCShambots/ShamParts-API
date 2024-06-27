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
    verifyUser,
    getUserFromToken,
    changeUserName,
    addUserRole,
    removeUserRole,
    getRoles,
    setUserRoles,
    sendVerificationEndpoint,
    resetPasswordEmail, testNotif, sendNotif, logOutUser
} from "../controllers/user.controller";


const router = express.Router();

router.get("/testnotif", testNotif)
router.post('/sendNotif', sendNotif)

router.get("/", getUser)
router.get("/fromToken", getUserFromToken)

router.get("/roles", getRoles)
router.patch("/addRole", addUserRole)
router.patch("/removeRole", removeUserRole)
router.patch("/setRoles", setUserRoles)

router.post("/create", createUser)
router.post("/sendVerificationEmail", sendVerificationEndpoint)
router.get("/verify", verifyUser)
router.get("/authenticate", authenticateUser)
router.delete("/logout", logOutUser)
router.get("/cancel", cancelUser)
router.get("/users", getUsers)

router.patch("/changeName", changeUserName)
router.patch("/forgot", forgotPassword)
router.post("/resetPassword", resetPassword)
router.post("/resetPasswordEmail", resetPasswordEmail)
router.get("/resetPasswordPage", resetPasswordPage)
router.delete("/delete", deleteUser)

export default router