import { AMLRequest, AMLResponse, AMLResult } from '../common/interfaces';
import { Response } from 'express';
import { getTopTenWinners } from './leaderboard.service';

export const getLeaderboard = async (
	req: AMLRequest<never>,
	res: AMLResponse,
): Promise<Response<AMLResult>> => {
	const winners = await getTopTenWinners();
	return res.json(new AMLResult('Leaderboard', 200, { winners }));
};

export default {
	getLeaderboard,
};
