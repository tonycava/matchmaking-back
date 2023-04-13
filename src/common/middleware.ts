import { AMLRequest, AMLResponse, AMLResult } from './interfaces';
import { NextFunction, Response } from 'express';
import { ZodSchema } from 'zod';
import { formatZodParseResponseOneLine } from './utils';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const dtoValidation = <T>(next: NextFunction, item: T, validator: ZodSchema<T>): void => {
	const zodResponse = validator.safeParse(item);
	if (!zodResponse.success) {
		return next(new AMLResult(formatZodParseResponseOneLine(zodResponse) ?? 'Bad request', 400));
	}
	return next();
};

export const checkToken = async (
	token: string | undefined
): Promise<[boolean, null | JwtPayload]> => {
	if (!token) return [false, null];
	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET ?? '') as JwtPayload;
		return [true, payload];
	} catch (error) {
		return [false, null];
	}
};

export const checkAuth = async (
	req: AMLRequest<any>,
	res: AMLResponse,
	next: NextFunction
): Promise<Response<AMLResult> | void> => {
	const [isValid, payload] = await checkToken(req.headers?.authorization);
	if (isValid) {
		res.locals.user = payload;
		return next();
	}
	return res.json(new AMLResult('Unauthorized', 401));
};
