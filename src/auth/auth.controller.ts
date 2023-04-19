import { AMLRequest, AMLResponse, AMLResult } from '../common/interfaces';
import { AuthDTO } from '../lib/dto';
import { NextFunction, Response } from 'express';
import { createUser, getUserByUsername } from './auth.service';
import bcrypt from 'bcrypt';
import { signToken } from '../common/utils';

export const register = async (
	req: AMLRequest<AuthDTO>,
	res: AMLResponse
): Promise<Response<AMLResult>> => {
	try {
		const { username, id, createdAt, role } = await createUser(req.body);
		const token = signToken({ id, username, createdAt, role });

		return res.status(201).json(new AMLResult('User created', 201, { token }));
	} catch (error) {
		return res.status(201).json(new AMLResult('Something went wrong', 400));
	}
};

const login = async (
	req: AMLRequest<AuthDTO>,
	res: AMLResponse,
	next: NextFunction
): Promise<Response<AMLResult> | void> => {
	try {
		const user = await getUserByUsername(req.body.username);
		if (!user) {
			return next(new AMLResult('Invalid credentials', 404));
		}

		const isPasswordValid = await bcrypt.compare(req.body.password, user.hashedPassword);
		if (!isPasswordValid) {
			return next(new AMLResult('Invalid credentials', 401));
		}

		const { id, username, createdAt, role } = user;
		const token = signToken({ id, username, createdAt, role });

		if (!token) return next(new AMLResult('Unauthorized', 401));
		return res.json(new AMLResult('User logged in', 200, { token }));
	} catch (error: any) {
		return next(new AMLResult(error.message ?? 'Something went wrong', 400));
	}
};

export default {
	register,
	login
};
