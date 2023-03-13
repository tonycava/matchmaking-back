import { ALMMatcherResult } from './interfaces';
import { NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { formatZodParseResponseOneLine } from './utils';

export const dtoValidation = <T>(next: NextFunction, item: T, validator: ZodSchema<T>): void => {
	const zodResponse = validator.safeParse(item);
	if (!zodResponse.success) {
		return next(
			new ALMMatcherResult(formatZodParseResponseOneLine(zodResponse) ?? 'Bad request', 400),
		);
	}
	return next();
};