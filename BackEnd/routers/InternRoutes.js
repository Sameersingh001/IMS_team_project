
import express from 'express';
import { createIntern, getApplicationStatus} from '../controllers/InternControllers.js';
const router = express.Router();

router.post('/createIntern', createIntern);
router.get('/application-status', getApplicationStatus);

export default router;