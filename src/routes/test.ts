import express from 'express';
import {testFunction} from "../controllers/test.controller";

const router = express.Router();

router.get('/testRoute', testFunction);

export default router;