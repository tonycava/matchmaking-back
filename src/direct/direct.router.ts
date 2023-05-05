import express from 'express';
import { checkAuth } from '../common/middleware';
import DirectController from './direct.controller';

const router = express.Router();

router.get('/directs', checkAuth, DirectController.getDirectsChats);

router.get('/', checkAuth, DirectController.getConversations);

export default router;
