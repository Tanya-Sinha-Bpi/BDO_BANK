import { Router } from "express";
import { forgotPassword, loginUser, logout, registerUser, resetPassword, sendOtp, verifyOtp } from "../Controller/AuthController.js";

const router = Router();

router.post('/register', registerUser, sendOtp);
router.post('/send-otp', sendOtp);
router.post('/verify-email', verifyOtp);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-passwword', resetPassword);
router.post('/logout', logout);

export default router;