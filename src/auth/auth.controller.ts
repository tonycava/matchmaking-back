import { ALMMatcherRequest, ALMMatcherResponse, ALMMatcherResult } from '../common/interfaces';
import { AuthDTO } from '../lib/dto';
import { NextFunction, Response } from 'express';
import process from 'process';
import { createUser, getUserByEmail } from './auth.service';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const register = async (
	req: ALMMatcherRequest<AuthDTO>,
	res: ALMMatcherResponse,
	next: NextFunction,
) => {
	try {
		const { username, id, createdAt } = await createUser(req.body);
		const token = jwt.sign({ id, username, createdAt  }, process.env.JWT_SECRET ?? '', {
			expiresIn: '7d',
		});
		return res.status(201).json(new ALMMatcherResult('User created', 201, { ...{ id, username, createdAt  }, token }));
	} catch (error) {
		return res.status(201).json(new ALMMatcherResult('Something went wrong', 400));
	}
};

const login = async (
	req: ALMMatcherRequest<AuthDTO>,
	res: ALMMatcherResponse,
	next: NextFunction,
): Promise<Response<ALMMatcherResult> | void> => {
	try {
		const user = await getUserByEmail(req.body.username);
		if (!user) {
			return next(new ALMMatcherResult('User doesn\'t exist', 400));
		}

		const isPasswordValid = await bcrypt.compare(req.body.password, user.hashedPassword);
		if (!isPasswordValid) {
			return next(new ALMMatcherResult('Invalid password', 400));
		}

		const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET ?? '', {
			expiresIn: '7d',
		});

		if (!token) return next(new ALMMatcherResult('Unauthorized', 401));
		return res.json(new ALMMatcherResult('User logged in', 200, { token }));
	} catch (error: any) {
		return next(new ALMMatcherResult(error.message ?? 'Something went wrong', 400));
	}
};


export default {
	register,
	login,
};