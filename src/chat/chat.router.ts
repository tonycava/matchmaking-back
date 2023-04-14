import express from 'express';
import ChatController from './chat.controller';
import { checkAuth } from '../common/middleware';

const router = express.Router();

router.get('/', checkAuth, ChatController.getChat);

export default router;
