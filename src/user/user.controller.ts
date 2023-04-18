import { NextFunction, Response } from 'express';
import { AMLRequest, AMLResponse, AMLResult } from '../common/interfaces';
import { changeProfilePicture, getUserInformationById } from './user.service';
import { LocalsDTO, UploadProfilePictureDTO } from '../lib/dto';
import { Chat } from 'matchmaking-shared';

const getInformations = async (
	req: AMLRequest<never>,
	res: AMLResponse<
		{
			user: {
				profilePicture: string;
				id: string;
				username: string;
				createdAt: Date;
			};
			chats: Chat[];
		},
		LocalsDTO
	>,
	next: NextFunction
): Promise<void | Response<
	AMLResult<{
		user: {
			profilePicture: string;
			id: string;
			username: string;
			createdAt: Date;
		};
		chats: Chat[];
	}>,
	LocalsDTO
>> => {
	const { userid = '' } = req.headers as { userid: string };
	if (!userid) return next(new AMLResult('Missing userId', 400));

	const {
		profilePicture,
		id,
		username,
		private: isAccountPrivate,
		loserGames,
		createdAt,
		followers,
		followed,
		chats,
		winnerGames,
		_count: {
			loserGames: numberOfLoses,
			winnerGames: numberOfWins,
			followers: followersCount,
			followed: followedCount
		}
	} = await getUserInformationById(userid);

	const games = [...winnerGames, ...loserGames]
		.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
		.map((game) => ({
			...game,
			result: game.winnerId === userid ? 'win' : 'loose'
		}));

	return res.json(
		new AMLResult('User information retrieved successfully', 200, {
			user: {
				id,
				username,
				createdAt,
				profilePicture,
				isAccountPrivate,
				numberOfWins,
				numberOfLoses,
				followedCount: followersCount,
				followersCount: followedCount,
				followed: followers,
				followers: followed,
				games
			},
			chats
		})
	);
};

const uploadProfilePicture = async (
	req: AMLRequest<UploadProfilePictureDTO>,
	res: AMLResponse<{ profilePicture: string }, LocalsDTO>
): Promise<Response<AMLResult<{ profilePicture: string }>, LocalsDTO>> => {
	const { profilePicture } = await changeProfilePicture(
		res.locals.user.id,
		req.body.profilePicture
	);
	return res.json(
		new AMLResult('Profile picture updated successfully', 200, {
			profilePicture
		})
	);
};
export default {
	getInformations,
	uploadProfilePicture
};
