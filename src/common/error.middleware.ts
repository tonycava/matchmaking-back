import { NextFunction, Request, Response } from 'express';
import { ALMResult } from './interfaces';

export const errorHandlerMiddleware = (
	error: ALMResult,
	req: Request,
	res: Response,
	next: NextFunction
): Response => {
	return res
		.status(error.code ?? 400)
		.json({ message: error.message, code: error.code, data: error.data });
};
