"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const router = express_1.default.Router();
router.get("/", user_controller_1.getUser);
router.get("/fromToken", user_controller_1.getUserFromToken);
router.get("/roles", user_controller_1.getRoles);
router.patch("/addRole", user_controller_1.addUserRole);
router.patch("/removeRole", user_controller_1.removeUserRole);
router.patch("/setRoles", user_controller_1.setUserRoles);
router.post("/create", user_controller_1.createUser);
router.post("/sendVerificationEmail", user_controller_1.sendEmail);
router.get("/verify", user_controller_1.verifyUser);
router.get("/authenticate", user_controller_1.authenticateUser);
router.get("/cancel", user_controller_1.cancelUser);
router.get("/users", user_controller_1.getUsers);
router.patch("/changeName", user_controller_1.changeUserName);
router.patch("/forgot", user_controller_1.forgotPassword);
router.post("/resetPassword", user_controller_1.resetPassword);
router.get("/resetPasswordPage", user_controller_1.resetPasswordPage);
router.delete("/delete", user_controller_1.deleteUser);
exports.default = router;
//# sourceMappingURL=user.js.map