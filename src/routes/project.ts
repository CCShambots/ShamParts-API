import express from 'express';
import {createProject} from "../controllers/project.controller";

const router = express.Router();

router.post('/create', createProject);

export default router;