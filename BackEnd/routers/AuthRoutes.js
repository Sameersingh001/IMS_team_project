import express from 'express';
import { registerUser , loginUser, checkAuth } from '../controllers/AuthController.js';
import {verifyToken} from '../middlewares/AuthVerify.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get("/check-auth", verifyToken, checkAuth);

export default router;