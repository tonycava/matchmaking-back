import { AMLRequest, AMLResponse, AMLResult } from '../common/interfaces';
import { NextFunction, Response } from 'express';
import { checkToken } from '../common/middleware';

export const checkAuth = async (
	req: AMLRequest<never>,
	res: AMLResponse,
	next: NextFunction,
): Promise<Response<AMLResult> | void> => {
	const isValid = await checkToken(req.headers?.authorization);
	if (isValid) {
		return next();
	}
	return res.json(new AMLResult('Unauthorized', 401));
};
