import type { Request, Response } from 'express';

export class ALMResult<D = Record<string, any>> {
	constructor(public message: string, public code: number, public data: D = null) {}
}

export type ALMRequest<Body, Query = null> = Request<any, ALMResult, Body, Query>;
export type ALMResponse<
	ResultPayload = Record<string, any>,
	Locals extends Record<string, any> = Record<string, any>
> = Response<ALMResult<ResultPayload>, Locals>;
