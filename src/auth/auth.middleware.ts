import { AMLRequest, AMLResponse, AMLResult } from '../common/interfaces';
import { NextFunction } from 'express';
import { getUserByUsername } from './auth.service';
import { AuthDTO } from '../lib/dto';
import { Response } from 'express';

export const checkIfUsernameIsAvailable = async (
	req: AMLRequest<AuthDTO>,
	res: AMLResponse,
	next: NextFunction
): Promise<void | Response> => {
	const { username } = req.body;
	const user = await getUserByUsername(username);
	if (user) return res.send(new AMLResult('Username already taken', 404));
	return next();
};
