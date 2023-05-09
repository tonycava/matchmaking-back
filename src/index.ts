import express, { type Request, type Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import process from 'process';

import authRouter from './auth/auth.router';
import socialRouter from './social/social.router';
import chatRouter from './chat/chat.router';
import leaderboardRouter from './leaderboard/leaderboard.router';
import userRouter from './user/user.router';
import directRouter from './direct/direct.router';

import { errorHandlerMiddleware } from './common/error.middleware';
import { CORS_CONFIG } from './lib/config';
import { AMLResult } from './common/interfaces';

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
export const io = new Server(server, { cors: CORS_CONFIG });

import './gateway/gateway.controller';

app.use(express.json());
app.use(cors(CORS_CONFIG));

app.use('/auth', authRouter);
app.use('/chat', chatRouter);
app.use('/leaderboard', leaderboardRouter);
app.use('/user', userRouter);
app.use('/social', socialRouter);
app.use('/direct', directRouter);

app.get('/', (req: Request, res: Response) => res.send(new AMLResult('Hello World', 200)));

app.use(errorHandlerMiddleware);

if (process.env.NODE_ENV !== 'test') {
	server.listen(PORT, () => {
		console.log(`Server is running on http://localhost:${PORT}`);
	});
}

export default app;
