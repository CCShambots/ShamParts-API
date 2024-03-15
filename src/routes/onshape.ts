import express from 'express';
import {getAssemblies, getDocuments} from "../controllers/onshape.controller";

const router = express.Router();

router.get('/documents', getDocuments);
router.get('/assemblies', getAssemblies);

export default router;