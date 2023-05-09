import { AMLRequest, AMLResponse, AMLResult } from '../common/interfaces';
import { NextFunction, Response } from 'express';
import { getUserByUsername } from './auth.service';
import { AuthDTO } from '../lib/dto';

export const checkIfUsernameIsAvailable = async (
	req: AMLRequest<AuthDTO>,
	res: AMLResponse,
	next: NextFunction
): Promise<void | Response> => {
	const { username } = req.body;
	const user = await getUserByUsername(username);
	if (user) return next(new AMLResult('Username already taken', 404));
	return next();
};
