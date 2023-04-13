import { z } from 'zod';

export const authDTO = z.object({
	username: z.string().min(1, { message: 'Username is required' }),
	password: z.string().min(1, { message: 'Password is required' })
});

export const uploadProfilePictureDTO = z.object({
	profilePicture: z.string().min(1, { message: 'Profile picture is required' })
});

export type LocalsDTO = {
	user: {
		id: string;
		username: string;
		createdAt: Date;
	};
};

export type UploadProfilePictureDTO = z.infer<typeof uploadProfilePictureDTO>;

export type AuthDTO = z.infer<typeof authDTO>;

export type Range = {
	start: string;
	end: string;
};
