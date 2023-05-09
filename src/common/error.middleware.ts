import { NextFunction, Request, Response } from 'express';
import { AMLResult } from './interfaces';

export const errorHandlerMiddleware = (
	error: AMLResult,
	req: Request,
	res: Response,
	next: NextFunction
): Response => {
	return res
		.status(error.code)
		.json({ message: error.message, code: error.code, data: error.data });
};
