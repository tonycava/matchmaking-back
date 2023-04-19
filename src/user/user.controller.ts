import { NextFunction, Response } from 'express';
import { AMLRequest, AMLResponse, AMLResult } from '../common/interfaces';
import {
	changeProfilePicture,
	changeStatus,
	getUserInformationById,
	isAccountFollowingMe,
	isAccountInApplication
} from './user.service';
import { LocalsDTO, UpdateStatusDTO, UploadProfilePictureDTO } from '../lib/dto';
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
		whoFollow,
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

	const haveAccess = !!(await isAccountFollowingMe(res.locals.user.id, userid));
	const isAlreadyApplicating = !!(await isAccountInApplication(userid, res.locals.user.id));

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
				isAlreadyApplicating,
				whoFollow,
				numberOfWins,
				numberOfLoses,
				followersCount,
				followedCount,
				followers,
				followed,
				games,
				haveAccess
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

const updateStatus = async (
	req: AMLRequest<UpdateStatusDTO>,
	res: AMLResponse<{ status: boolean }, LocalsDTO>
): Promise<Response<AMLResult<{ status: boolean }>>> => {
	const { private: status } = await changeStatus(res.locals.user.id, req.body.status);
	return res.json(new AMLResult('Status updated successfully', 200, { status }));
};

export default {
	getInformations,
	uploadProfilePicture,
	updateStatus
};
