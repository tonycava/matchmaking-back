import express from 'express';
import { checkAuth, dtoValidation } from '../common/middleware';
import SocialController from './social.controller';
import { acceptApplicationDTO, addApplicationDTO, removeApplicationDTO, removeWaitingApplication } from '../lib/dto';

const router = express.Router();

router.post('/add-follow', checkAuth, SocialController.addFollow);
router.post(
	'/add-application',
	checkAuth,
	(req, res, next) => dtoValidation(next, req.body, addApplicationDTO),
	SocialController.addApplication
);

router.post(
	'/remove-application',
	checkAuth,
	(req, res, next) => dtoValidation(next, req.body, removeApplicationDTO),
	SocialController.removeApplication
);

router.post(
	'/remove-waiting-application',
	checkAuth,
	(req, res, next) => dtoValidation(next, req.body, removeWaitingApplication),
	SocialController.removeWaitingApplication
);

router.post(
	'/accept-application',
	checkAuth,
	(req, res, next) => dtoValidation(next, req.body, acceptApplicationDTO),
	SocialController.acceptApplication
);

router.post('/remove-follow', checkAuth, SocialController.removeFollow);

export default router;
