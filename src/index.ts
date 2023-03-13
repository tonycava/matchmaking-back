import express from 'express';
import dotenv from 'dotenv';
import authRouter from './auth/auth.router';
import { errorHandlerMiddleware } from './common/error.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/auth', authRouter);

app.get('/', (req, res) => {
	res.send('Hello World! chang');
});

app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
	console.log(`Server is running on port http://localhost:${PORT}`);
});