import { AMLRequest, AMLResponse, AMLResult } from '../common/interfaces';
import { LocalsDTO, UpdateStatusDTO } from '../lib/dto';
import { NextFunction } from 'express';

export const isTokenSignWithAdmin = (
	req: AMLRequest<UpdateStatusDTO>,
	res: AMLResponse<any, LocalsDTO>,
	next: NextFunction
) => {
	const { role } = res.locals.user;
	if (role === 'ADMIN') return next();
	return next(new AMLResult('You are not an admin', 400));
};