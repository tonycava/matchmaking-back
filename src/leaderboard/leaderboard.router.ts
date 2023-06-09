import express from 'express';
import LeaderboardController from './leaderboard.controller';
import { checkAuth } from '../common/middleware';

const router = express.Router();

router.get('/', checkAuth, LeaderboardController.getLeaderboard);

export default router;
