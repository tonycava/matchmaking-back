import { ALMResult } from './interfaces';

export const isAMLResultShaped = (result: unknown): result is ALMResult => {
	if (typeof result !== 'object' || result === null) return false;
	if (!result.hasOwnProperty('code')) return false;
	return result.hasOwnProperty('message');
};
