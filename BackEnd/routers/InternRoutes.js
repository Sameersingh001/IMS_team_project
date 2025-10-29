
import express from 'express';
import { createIntern, getApplicationStatus, verifyIntern} from '../controllers/InternControllers.js';
const router = express.Router();

router.post('/createIntern', createIntern);
router.post('/intern/verify', verifyIntern);
router.get('/application-status', getApplicationStatus);

export default router;