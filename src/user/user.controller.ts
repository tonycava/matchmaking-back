import { NextFunction, Response } from 'express';
import { ALMRequest, ALMResponse, ALMResult } from '../common/interfaces';
import {
	changeProfilePicture,
	changeRole,
	changeStatus,
	getUserInformationById,
	isAccountAlreadyExist,
	isAccountFollowingMe,
	isAccountInApplication
} from './user.service';
import { LocalsDTO, UpdateStatusDTO, UploadProfilePictureDTO } from '../lib/dto';
import { Chat } from 'matchmaking-shared';

const getInformations = async (
	req: ALMRequest<never>,
	res: ALMResponse<
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
	ALMResult<{
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
	if (!userid) return next(new ALMResult('Missing userId', 400));

	const user = await isAccountAlreadyExist(userid);
	if (!user) {
		return next(new ALMResult('Account does not exist', 303));
	}
	const {
		profilePicture,
		id,
		username,
		whoFollow,
		private: isAccountPrivate,
		loserGames,
		createdAt,
		role,
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
		new ALMResult('User information retrieved successfully', 200, {
			user: {
				id,
				role,
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
	req: ALMRequest<UploadProfilePictureDTO>,
	res: ALMResponse<{ profilePicture: string }, LocalsDTO>
): Promise<Response<ALMResult<{ profilePicture: string }>, LocalsDTO>> => {
	const { profilePicture } = await changeProfilePicture(
		res.locals.user.id,
		req.body.profilePicture
	);
	res.json(
		new ALMResult('Profile picture updated successfully', 200, {
			profilePicture
		})
	);
	return;
};

const updateStatus = async (
	req: ALMRequest<UpdateStatusDTO>,
	res: ALMResponse<{ status: boolean }, LocalsDTO>
): Promise<Response<ALMResult<{ status: boolean }>>> => {
	const { private: status } = await changeStatus(res.locals.user.id, req.body.status);
	return res.json(new ALMResult('Status updated successfully', 200, { status }));
};

const promote = async (
	req: ALMRequest<UpdateStatusDTO>,
	res: ALMResponse<null, LocalsDTO>
): Promise<Response<ALMResult<null>>> => {
	await changeRole(res.locals.user.id, 'ADMIN');
	return res.json(new ALMResult('Role updated successfully', 200));
};

export default {
	getInformations,
	uploadProfilePicture,
	updateStatus,
	promote
};
