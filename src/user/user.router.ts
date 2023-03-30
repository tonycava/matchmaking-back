import express from 'express';
import { checkAuth } from '../common/middleware';
import UserController from './user.controller';

const router = express.Router();

router.get('/', checkAuth, UserController.getInformations);

export default router;
