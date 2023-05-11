import { AMLRequest, AMLResponse, AMLResult } from '../common/interfaces';
import { AuthDTO } from '../lib/dto';
import { NextFunction, Response } from 'express';
import { createUser, getUserByUsername } from './auth.service';
import bcrypt from 'bcrypt';
import prisma from '../lib/db';
import { authenticator } from 'otplib';
import { signToken } from '../common/utils';

export const register = async (
	req: AMLRequest<AuthDTO>,
	res: AMLResponse,
	next: NextFunction
): Promise<Response<AMLResult> | void> => {
	if (req.body.username.includes(' ') || req.body.password.includes(' '))
		return next(new AMLResult('Spaces are not authorized in this field', 400));
	try {
		const { username, id, createdAt, secret, role } = await createUser(req.body);
		const token = signToken({ id, username, createdAt, role, secret });
		const authKey = authenticator.keyuri(username, 'ALM-Matcher', secret);
		return res.status(201).json(new AMLResult('User created', 201, { token, authKey }));
	} catch (error) {
		return res.status(201).json(new AMLResult('Something went wrong', 400));
	}
};

const login = async (
	req: AMLRequest<AuthDTO>,
	res: AMLResponse,
	next: NextFunction
): Promise<Response<AMLResult> | void> => {
	if (req.body.username.includes(' ') || req.body.password.includes(' '))
		return next(new AMLResult('Spaces are not authorized in this field', 400));
	try {
		const user = await getUserByUsername(req.body.username);
		if (!user) {
			return next(new AMLResult('Invalid credentials', 404));
		}

		const isPasswordValid = await bcrypt.compare(req.body.password, user.hashedPassword);
		if (!isPasswordValid) {
			return next(new AMLResult('Invalid credentials', 401));
		}

		const { id, username, createdAt, secret, role } = user;
		const token = signToken({ id, username, createdAt, role, secret });
		const authKey = authenticator.keyuri(username, 'ALM-Matcher', secret);

		if (!token) return next(new AMLResult('Unauthorized', 401));
		return res.json(new AMLResult('User logged in', 200, { token, authKey }));
	} catch (error: any) {
		return next(new AMLResult(error.message ?? 'Something went wrong', 400));
	}
};

const truncate = async (
	req: AMLRequest<AuthDTO>,
	res: AMLResponse
): Promise<Response<AMLResult>> => {
	try {
		await prisma.chat.deleteMany();
		await prisma.game.deleteMany();
		await prisma.user.deleteMany();
		return res.status(200).json(new AMLResult('Database truncated', 200));
	} catch (error) {
		return res.status(400).json(new AMLResult('Something went wrong', 400));
	}
};

export default {
	register,
	login,
	truncate
};
