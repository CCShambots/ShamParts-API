import express from 'express';
import {fulfillRequest, loadPartThumbnail, reportBreakage, requestAdditional} from "../controllers/part.controller";

const router = express.Router();

router.get('/:id/loadImage', loadPartThumbnail);
router.get('/:id/break', reportBreakage);
router.get('/:id/request', requestAdditional);
router.get('/:id/fulfill', fulfillRequest);

export default router;