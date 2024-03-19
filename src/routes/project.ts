import express from 'express';
import {createProject, getProject, getProjects, testMultiResult} from "../controllers/project.controller";

const router = express.Router();

router.post('/create', createProject);
router.get('/list', getProjects);
router.get('/:name', getProject);

export default router;