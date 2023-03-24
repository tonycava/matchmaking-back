import { AMLRequest, AMLResponse, AMLResult } from '../common/interfaces';
import { NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Range } from '../lib/dto';

export const checkToken = async (
	req: AMLRequest<never, Range>,
	res: AMLResponse,
	next: NextFunction,
): Promise<void> => {
	const token = req.headers.authorization;
	if (!token) return next(new AMLResult('Unauthorized', 401));
	try {
		jwt.verify(token, process.env.JWT_SECRET ?? '');
		return next();
	} catch (error) {
		return next(new AMLResult('Unauthorized', 401));
	}
};
