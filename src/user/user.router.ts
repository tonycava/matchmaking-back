import express from 'express';
import { checkAuth, dtoValidation } from '../common/middleware';
import UserController from './user.controller';
import { promoteDTO, updateStatusDTO, uploadProfilePictureDTO } from '../lib/dto';
import { isTokenSignWithAdmin } from './user.middleware';
import { rateLimit } from 'express-rate-limit';
import { ALMResult } from '../common/interfaces';

const router = express.Router();

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 1, // Limit each IP to 1 request per `window` (here, per 15 minutes)
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
