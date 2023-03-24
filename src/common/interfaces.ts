import type { Request, Response } from 'express';

export class AMLResult<D = Record<string, any>> {
	constructor(public message: string, public code: number, public data?: D) {}
}

export type AMLRequest<Body, Query = null> = Request<any, AMLResult, Body, Query>;
export type AMLResponse<
	ResultPayload = Record<string, any>,
	Locals extends Record<string, any> = Record<string, any>,
> = Response<AMLResult<ResultPayload>, Locals>;
