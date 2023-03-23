import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

import authRouter from './auth/auth.router';
import chatRouter from './chat/chat.router';

import { errorHandlerMiddleware } from './common/error.middleware';
import { CORS_CONFIG } from './lib/utils';

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

app.get('/', (req, res) => res.send('Hello World!'));

app.use(errorHandlerMiddleware);

server.listen(PORT, () => {
	console.log(`Server is running on port http://localhost:${PORT}`);
});
