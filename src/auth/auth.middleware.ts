import { ALMRequest, ALMResponse, ALMResult } from '../common/interfaces';
import { NextFunction, Response } from 'express';
import { getUserByUsername } from './auth.service';
import { AuthDTO } from '../lib/dto';

export const checkIfUsernameIsAvailable = async (
	req: ALMRequest<AuthDTO>,
	res: ALMResponse,
	next: NextFunction
): Promise<void | Response> => {
	const { username } = req.body;
	const user = await getUserByUsername(username);
	if (user) return next(new ALMResult('Username already taken', 404));
	return next();
};
