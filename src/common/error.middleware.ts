import { NextFunction, Request, Response } from 'express';

export class ErrorMiddleware<T> {
	constructor(public code: number, public message: string, public payload: T) {}
}

export const errorHandlerMiddleware = (
	error: ErrorMiddleware<unknown>,
	req: Request,
	res: Response,
	next: NextFunction,
): void => {
	res.status(error.code).send({ message: error.message, payload: error.payload });
	return next();
};
