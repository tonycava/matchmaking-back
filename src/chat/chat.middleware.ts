import { ALMMatcherRequest, ALMMatcherResponse, ALMMatcherResult } from '../common/interfaces';
import { NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Range } from '../lib/dto';

export const checkToken = async (
	req: ALMMatcherRequest<never, Range>,
	res: ALMMatcherResponse,
	next: NextFunction,
): Promise<void> => {
	const token = req.headers.authorization;
	if (!token) return next(new ALMMatcherResult('Unauthorized', 401));
	try {
		jwt.verify(token, process.env.JWT_SECRET ?? '');
		return next();
	} catch (error) {
		return next(new ALMMatcherResult('Unauthorized', 401));
	}
};
