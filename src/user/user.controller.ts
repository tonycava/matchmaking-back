import { NextFunction, Response } from 'express';
import { AMLRequest, AMLResponse, AMLResult } from '../common/interfaces';
import { changeProfilePicture, getUserInformationById } from './user.service';
import { LocalsDTO, UploadProfilePictureDTO } from '../lib/dto';
import { ChatService } from '../chat/chat.service';

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
			chats: ChatService[];
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
		chats: ChatService[];
	}>,
	LocalsDTO
>> => {
	const { userid = '' } = req.headers as { userid: string };
	if (!userid) return next(new AMLResult('Missing userId', 400));

	const {
		profilePicture,
		id,
		username,
		createdAt,
		chats,
		_count: { loserGames, winnerGames }
	} = await getUserInformationById(userid);

	return res.json(
		new AMLResult('Profile picture retrieved successfully', 200, {
			user: {
				id,
				username,
				createdAt,
				profilePicture,
				numberOfWins: winnerGames,
				numberOfLoses: loserGames
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
