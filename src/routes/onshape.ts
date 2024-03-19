import express from 'express';
import {getAssemblies, getDocuments, getOnshapeKey} from "../controllers/onshape.controller";

const router = express.Router();

router.get('/documents', getDocuments);
router.get('/assemblies', getAssemblies);
router.get('/key', getOnshapeKey);

export default router;