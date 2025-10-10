import express from 'express';
import { registerUser , loginUser, checkAuth, forgotPassword, verifyOtp, resetPassword, resendOtp} from '../controllers/AuthController.js';
import {verifyToken} from '../middlewares/AuthVerify.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp',verifyOtp);
router.post('/reset-password', resetPassword);
router.post('/resend-otp', resendOtp);


router.get("/check-auth", verifyToken, checkAuth);

export default router;