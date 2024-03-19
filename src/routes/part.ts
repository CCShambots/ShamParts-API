import express from 'express';
import {loadPartThumbnail} from "../controllers/part.controller";

const router = express.Router();

router.get('/:id/loadImage', loadPartThumbnail);

export default router;