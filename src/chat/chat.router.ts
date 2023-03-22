import express from 'express';
import { checkToken } from './chat.middleware';
import ChatController from './chat.controller';

const router = express.Router();

router.get('/', checkToken, ChatController.getChat);

export default router;
