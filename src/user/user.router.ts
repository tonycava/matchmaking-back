import express from 'express';
import { checkAuth, dtoValidation } from '../common/middleware';
import UserController from './user.controller';
import { uploadProfilePictureDTO } from '../lib/dto';

const router = express.Router();

router.post(
	'/upload-profile-picture',
	(req, res, next) => dtoValidation(next, req.body, uploadProfilePictureDTO),
	checkAuth,
	UserController.uploadProfilePicture
);

router.get('/', checkAuth, UserController.getInformations);

export default router;
