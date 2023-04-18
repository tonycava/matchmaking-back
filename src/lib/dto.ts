import { z } from 'zod';

export const authDTO = z.object({
	username: z.string().min(1, { message: 'Username is required' }),
	password: z.string().min(1, { message: 'Password is required' })
});
export const uploadProfilePictureDTO = z.object({
	profilePicture: z.string().min(1, { message: 'Profile picture is required' })
});

export const addFollowDTO = z.object({
	userIdToFollow: z.string().min(1, { message: 'User ID to follow is required' })
});

export const unFollowDTO = z.object({
	userIdToUnFollow: z.string().min(1, { message: 'User ID to follow is required' })
});

export type AddFollowDTO = z.infer<typeof addFollowDTO>;
export type UnFollowDTO = z.infer<typeof unFollowDTO>;

export type LocalsDTO = {
	user: {
		id: string;
		username: string;
		createdAt: Date;
	};
};

export type UploadProfilePictureDTO = z.infer<typeof uploadProfilePictureDTO>;

export type AuthDTO = z.infer<typeof authDTO>;
