import express from 'express';
import { dtoValidation } from '../common/middleware';
import { checkIfUsernameIsAvailable } from './auth.middleware';
import { authDTO } from '../lib/dto';
import AuthController from './auth.controller';
import process from "process";

const router = express.Router();

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

if (process.env.ENVIRONMENT === 'test') {
	router.delete('/truncate', AuthController.truncate);
}

export default router;
