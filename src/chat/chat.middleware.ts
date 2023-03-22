import { ALMMatcherRequest, ALMMatcherResponse, ALMMatcherResult } from '../common/interfaces';
import { NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const checkToken = async (
	req: ALMMatcherRequest<never>,
	res: ALMMatcherResponse,
	next: NextFunction,
): Promise<void> => {
	const token = req.headers.authorization;
	if (!token) return next(new ALMMatcherResult('Unauthorized', 401));
	try {
		jwt.verify(token, process.env.JWT_SECRET ?? '');
		console.log('Token verified');
		return next();
	} catch (error) {
		return next(new ALMMatcherResult('Unauthorized', 401));
	}
};
