import express from 'express';
import {
    assignUser,
    fulfillRequest,
    getPart,
    loadPartThumbnail,
    reportBreakage,
    requestAdditional, setDimensions, unAssignUser
} from "../controllers/part.controller";

const router = express.Router();

router.get('/:id', getPart);
router.get('/:id/loadImage', loadPartThumbnail);
router.get('/:id/break', reportBreakage);
router.get('/:id/request', requestAdditional);
router.get('/:id/fulfill', fulfillRequest);
router.patch('/:id/assign', assignUser)
router.delete('/:id/unAssign', unAssignUser)
router.patch("/:id/setDimensions", setDimensions)

export default router;