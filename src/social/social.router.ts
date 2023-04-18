import express from 'express';
import { checkAuth } from '../common/middleware';
import SocialController from './social.controller';

const router = express.Router();

router.post('/add-follow', checkAuth, SocialController.addFollow);
router.post('/remove-follow', checkAuth, SocialController.removeFollow);

export default router;
