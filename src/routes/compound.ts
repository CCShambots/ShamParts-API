import express from "express";
import {
    assignUser,
    camDone,
    createCompound, decrementPart, deleteCompound,
    fulfillCompound, incrementPart,
    unAssignUser, updateCompound, updateCamInstructions,
    uploadImage
} from "../controllers/compound.controller";

const router = express.Router();

router.post("/create", createCompound);
router.patch('/:id/assign', assignUser)
router.delete('/:id/unAssign', unAssignUser)
router.post("/:id/uploadImage", uploadImage)
router.patch("/:id/updateCamInstructions", updateCamInstructions)
router.patch("/:id/camDone", camDone)
router.post("/:id/fulfill", fulfillCompound)
router.patch("/:id/decrementPart", decrementPart)
router.patch("/:id/incrementPart", incrementPart)
router.delete("/:id/delete", deleteCompound)
router.patch("/:id/update", updateCompound)

export default router;