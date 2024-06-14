import express from 'express';
import {
    assignUser, camDone,
    fulfillRequest,
    getPart, getPartTypes,
    loadPartThumbnail, mergeWithOthers,
    reportBreakage,
    requestAdditional, setDimensions, setPartType, unAssignUser, updateCamInstructions
} from "../controllers/part.controller";

const router = express.Router();

router.get("/types", getPartTypes)
router.patch("/:id/setPartType", setPartType)

router.get('/:id', getPart);
router.get('/:id/loadImage', loadPartThumbnail);
router.get('/:id/break', reportBreakage);
router.get('/:id/request', requestAdditional);
router.get('/:id/fulfill', fulfillRequest);
router.patch('/:id/assign', assignUser)
router.delete('/:id/unAssign', unAssignUser)
router.patch("/:id/setDimensions", setDimensions)
router.patch("/:id/updateCamInstructions", updateCamInstructions)
router.patch("/:id/camDone", camDone)

router.post("/:id/merge", mergeWithOthers)


export default router;