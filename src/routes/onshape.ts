import express from 'express';
import {getDocuments} from "../controllers/onshape.controller";

const router = express.Router();

router.get('/documents', getDocuments);

export default router;