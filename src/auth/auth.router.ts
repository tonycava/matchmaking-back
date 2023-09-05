import express from 'express';
import { checkAuth, dtoValidation } from '../common/middleware';
import { checkIfUsernameIsAvailable } from './auth.middleware';
import { authDTO, verifyOTPDTO } from '../lib/dto';
import AuthController from './auth.controller';
import process from 'process';
import { rateLimit } from 'express-rate-limit';
import { ALMResult } from '../common/interfaces';

const router = express.Router();

const OTPLimiter = rateLimit({
	windowMs: 60 * 1000, // 1 minute
	max: 5, // Limit each IP to 1 request per `window` (here, per 15 minutes)
	message: new ALMResult('Too many OTP requests, please try again later', 429)
});

router.post(
	'/login',
	(req, res, next) => dtoValidation(next, req.body, authDTO),
	AuthController.login
);
router.post(
	'/register',
	(req, res, next) => dtoValidation(next, req.body, authDTO),
	checkIfUsernameIsAvailable,
	AuthController.register
);

router.post(
	'/verify-otp',
	OTPLimiter,
	(req, res, next) => dtoValidation(next, req.body, verifyOTPDTO),
	checkAuth,
	AuthController.verifyOTP
);

if (process.env.ENVIRONMENT === 'test') {
	router.delete('/truncate', AuthController.truncate);
}

export default router;
