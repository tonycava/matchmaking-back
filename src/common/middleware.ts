import { AMLResult } from './interfaces';
import { NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { formatZodParseResponseOneLine } from './utils';
import jwt from 'jsonwebtoken';

export const dtoValidation = <T>(next: NextFunction, item: T, validator: ZodSchema<T>): void => {
	const zodResponse = validator.safeParse(item);
	if (!zodResponse.success) {
		return next(new AMLResult(formatZodParseResponseOneLine(zodResponse) ?? 'Bad request', 400));
	}
	return next();
};

export const checkToken = async (token: string | undefined): Promise<boolean> => {
	if (!token) return false;
	try {
		jwt.verify(token, process.env.JWT_SECRET ?? '');
		return true;
	} catch (error) {
		return false;
	}
};
