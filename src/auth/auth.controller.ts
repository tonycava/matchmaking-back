import { ALMRequest, ALMResponse, ALMResult } from '../common/interfaces';
import { AuthDTO, VerifyOTPDTO } from '../lib/dto';
import { NextFunction, Response } from 'express';
import { createUser, getUserByUsername } from './auth.service';
import bcrypt from 'bcrypt';
import prisma from '../lib/db';
import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import { signToken } from '../common/utils';

export const register = async (
	req: ALMRequest<AuthDTO>,
	res: ALMResponse,
	next: NextFunction
): Promise<Response<ALMResult> | void> => {
	if (req.body.username.includes(' ') || req.body.password.includes(' '))
		return next(new ALMResult('Spaces are not authorized in this field', 400));
	try {
		const { username, id, createdAt, secret, role } = await createUser(req.body);
		const token = signToken({ id, username, createdAt, role, optAuthenticated: false });
		const authKey = authenticator.keyuri(username, 'ALM-Matcher', secret);
		const qrCodeURL = await QRCode.toDataURL(authKey);
		return res.status(201).json(new ALMResult('User created', 201, { token, qrCodeURL }));
	} catch (error) {
		return res.status(201).json(new ALMResult('Something went wrong', 400));
	}
};

const login = async (
	req: ALMRequest<AuthDTO>,
	res: ALMResponse,
	next: NextFunction
): Promise<Response<ALMResult> | void> => {
	if (req.body.username.includes(' ') || req.body.password.includes(' '))
		return next(new ALMResult('Spaces are not authorized in this field', 400));
	try {
		const user = await getUserByUsername(req.body.username);
		if (!user) {
			return next(new ALMResult('Invalid credentials', 404));
		}

		const isPasswordValid = await bcrypt.compare(req.body.password, user.hashedPassword);
		if (!isPasswordValid) {
			return next(new ALMResult('Invalid credentials', 401));
		}

		const { id, username, createdAt, secret, role } = user;
		const token = signToken({ id, username, createdAt, role, optAuthenticated: false });
		if (!token) return next(new ALMResult('Unauthorized', 401));
		const authKey = authenticator.keyuri(username, 'ALM-Matcher', secret);
		const qrCodeURL = await QRCode.toDataURL(authKey);
		return res.status(201).json(new ALMResult('User created', 201, { token, qrCodeURL }));
	} catch (error: any) {
		return next(new ALMResult(error.message ?? 'Something went wrong', 400));
	}
};

const verifyOTP = async (
	req: ALMRequest<VerifyOTPDTO>,
	res: ALMResponse
): Promise<Response<ALMResult> | void> => {
	const { code } = req.body;
	const { secret, id, username, createdAt, role } = await getUserByUsername(
		res.locals.user.username
	);
	const isOTPValid = authenticator.check(code, secret);
	if (!isOTPValid) return res.status(401).json(new ALMResult('Invalid OTP', 401));
	const jwtToken = signToken({ id, username, createdAt, role, optAuthenticated: true });
	return res.status(200).json(
		new ALMResult('Valid OTP', 201, {
			token: jwtToken
		})
	);
};

const getQRCode = async (
	req: ALMRequest<never>,
	res: ALMResponse
): Promise<Response<ALMResult> | void> => {
	const { secret, username } = await getUserByUsername(res.locals.user.username);
	const authKey = authenticator.keyuri(username, 'ALM-Matcher', secret);
	const qrCodeURL = await QRCode.toDataURL(authKey);
	return res.status(200).json(new ALMResult('Valid OTP', 201, { qrCodeURL }));
};

const truncate = async (
	req: ALMRequest<AuthDTO>,
	res: ALMResponse
): Promise<Response<ALMResult>> => {
	try {
		await prisma.chat.deleteMany();
		await prisma.game.deleteMany();
		await prisma.user.deleteMany();
		return res.status(200).json(new ALMResult('Database truncated', 200));
	} catch (error) {
		return res.status(400).json(new ALMResult('Something went wrong', 400));
	}
};

export default {
	register,
	login,
	verifyOTP,
	getQRCode,
	truncate
};
