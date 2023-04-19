import express from 'express';
import { checkAuth, dtoValidation } from '../common/middleware';
import UserController from './user.controller';
import { promoteDTO, updateStatusDTO, uploadProfilePictureDTO } from '../lib/dto';
import { isTokenSignWithAdmin } from './user.middleware';

const router = express.Router();

router.post(
	'/upload-profile-picture',
	(req, res, next) => dtoValidation(next, req.body, uploadProfilePictureDTO),
	checkAuth,
	UserController.uploadProfilePicture
);

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

export default router;
