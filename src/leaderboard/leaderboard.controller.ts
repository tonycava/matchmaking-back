import { ALMRequest, ALMResponse, ALMResult } from '../common/interfaces';
import { Response } from 'express';
import { getTopTenWinners } from './leaderboard.service';

export const getLeaderboard = async (
	req: ALMRequest<never>,
	res: ALMResponse
): Promise<Response<ALMResult>> => {
	const winners = await getTopTenWinners();
	return res.json(new ALMResult('Leaderboard', 200, { winners }));
};

export default {
	getLeaderboard
};
