
import express from 'express';
import { createIntern } from '../controllers/InternControllers.js';
const router = express.Router();

router.post('/createIntern', createIntern);

export default router;