import express from 'express';
import { checkAuth, dtoValidation } from '../common/middleware';
import UserController from './user.controller';
import { promoteDTO, updateStatusDTO, uploadProfilePictureDTO } from '../lib/dto';
import { isTokenSignWithAdmin } from './user.middleware';
import rateLimit from 'express-rate-limit';
import { ALMResult } from '../common/interfaces';

const router = express.Router();

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 3, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
	message: new ALMResult('Please wait before upload a new profile image', 429)
});

router.post(
	'/promote',
	(req, res, next) => dtoValidation(next, req.body, promoteDTO),
	checkAuth,
	isTokenSignWithAdmin,
	UserController.promote
);

router.get('/', checkAuth, UserController.getInformations);

router.patch(
	'/update-status',
	checkAuth,
	(req, res, next) => dtoValidation(next, req.body, updateStatusDTO),
	UserController.updateStatus
);

router.post(
	'/upload-profile-picture',
	limiter,
	(req, res, next) => dtoValidation(next, req.body, uploadProfilePictureDTO),
	checkAuth,
	UserController.uploadProfilePicture
);

export default router;
