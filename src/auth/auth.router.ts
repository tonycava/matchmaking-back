import express from 'express';
import { dtoValidation } from '../common/middleware';
import { checkIfEmailIsAvailable } from './auth.middleware';
import { authDTO } from '../lib/dto';
import AuthController from './auth.controller';

const router = express.Router();

router.post(
	'/login',
	(req, res, next) => dtoValidation(next, req.body, authDTO),
	AuthController.login,
);
router.post(
	'/register',
	(req, res, next) => dtoValidation(next, req.body, authDTO),
	checkIfEmailIsAvailable,
	AuthController.register,
);

export default router;