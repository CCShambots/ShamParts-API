import express from 'express';
import {addRole, createProject, getProject, getProjects, removeRole} from "../controllers/project.controller";

const router = express.Router();

router.post('/create', createProject);
router.get('/list', getProjects);
router.get('/:name', getProject);

router.patch("/:name/addRole", addRole);
router.patch("/:name/removeRole", removeRole);

export default router;