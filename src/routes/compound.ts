import express from "express";
import {
    assignUser,
    camDone,
    createCompound,
    fulfillCompound,
    unAssignUser,
    uploadImage
} from "../controllers/compound.controller";

const router = express.Router();

router.post("/create", createCompound);
router.patch('/:id/assign', assignUser)
router.delete('/:id/unAssign', unAssignUser)
router.post("/:id/uploadImage", uploadImage)
router.patch("/:id/camDone", camDone)
router.post("/:id/fulfill", fulfillCompound)

export default router;