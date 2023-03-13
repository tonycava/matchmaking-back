import { ALMMatcherRequest, ALMMatcherResponse, ALMMatcherResult } from '../common/interfaces';
import { NextFunction } from 'express';
import { getUserByEmail } from './auth.service';
import { AuthDTO } from '../lib/dto';

export const checkIfEmailIsAvailable = async (
	req: ALMMatcherRequest<AuthDTO>,
	res: ALMMatcherResponse,
	next: NextFunction,
): Promise<void> => {
	const { email } = req.body;
	const user = await getUserByEmail(email);
	if (user) return next(new ALMMatcherResult("Email already taken",400));
	return next();
};