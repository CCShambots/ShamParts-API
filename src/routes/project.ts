import express from 'express';
import {createProject, testMultiResult} from "../controllers/project.controller";

const router = express.Router();

router.post('/create', createProject);

export default router;