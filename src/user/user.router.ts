import express from 'express';
import { checkAuth, dtoValidation } from '../common/middleware';
import UserController from './user.controller';
import { uploadProfilePictureDTO } from '../lib/dto';

const router = express.Router();

router.get('/', checkAuth, UserController.getInformations);

router.post(
	'/upload-profile-picture',
	checkAuth,
	(req, res, next) => dtoValidation(next, req.body, uploadProfilePictureDTO),
	UserController.uploadProfilePicture,
);

export default router;
