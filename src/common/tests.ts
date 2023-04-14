import { AMLResult } from './interfaces';

export const isAMLResultShaped = (result: unknown): result is AMLResult => {
	if (typeof result !== 'object' || result === null) return false;
	if (!result.hasOwnProperty('code')) return false;
	return result.hasOwnProperty('message');
};
