import { ALMRequest, ALMResponse, ALMResult } from '../common/interfaces';
import { LocalsDTO, UpdateStatusDTO } from '../lib/dto';
import { NextFunction } from 'express';

export const isTokenSignWithAdmin = (
	req: ALMRequest<UpdateStatusDTO>,
	res: ALMResponse<any, LocalsDTO>,
	next: NextFunction
): void => {
	const { role } = res.locals.user;
	if (role === 'ADMIN') return next();
	return next(new ALMResult('You are not an admin', 400));
};
