import type { Request, Response } from 'express';

export class ALMMatcherResult<D = Record<string, any>> {
	constructor(public message: string, public code: number, public data?: D) {}
}

export type ALMMatcherRequest<Body, Query = null> = Request<any, ALMMatcherResult, Body, Query>;
export type ALMMatcherResponse<
	ResultPayload = Record<string, any>,
	Locals extends Record<string, any> = Record<string, any>,
> = Response<ALMMatcherResult<ResultPayload>, Locals>;
