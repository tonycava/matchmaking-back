import { z } from 'zod';
import { Role } from '@prisma/client';

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

export const updateStatusDTO = z.object({
	status: z.boolean()
});

export type UpdateStatusDTO = z.infer<typeof updateStatusDTO>;

export const addApplicationDTO = z.object({
	userIdToApply: z.string().min(1, { message: 'UserId to apply is required !' })
});

export type AddApplicationDTO = z.infer<typeof addApplicationDTO>;

export const unFollowDTO = z.object({
	userIdToUnFollow: z.string().min(1, { message: 'User ID to follow is required' })
});

export const removeApplicationDTO = z.object({
	applicationIdToUnApply: z.string().min(1, { message: 'ApplicationId ID to un apply is required' })
});

export type RemoveApplicationDTO = z.infer<typeof removeApplicationDTO>;

export const acceptApplicationDTO = z.object({
	applicationIdToApply: z.string().min(1, { message: 'Application ID to un apply is required' }),
	userIdToFollow: z.string().min(1, { message: 'User ID to follow is required' })
});

export type AcceptApplicationDTO = z.infer<typeof acceptApplicationDTO>;

export const removeWaitingApplication = z.object({
	userIdToUnWait: z.string().min(1, { message: 'User ID to unwait is required' })
});

export const promoteDTO = z.object({
	userIdToPromote: z.string().min(1, { message: 'User ID is required' })
});

export type PromoteDTO = z.infer<typeof promoteDTO>;

export type RemoveWaitingApplicationDTO = z.infer<typeof removeWaitingApplication>;

export type AddFollowDTO = z.infer<typeof addFollowDTO>;
export type UnFollowDTO = z.infer<typeof unFollowDTO>;

export type LocalsDTO = {
	user: {
		id: string;
		username: string;
		createdAt: Date;
		role: Role;
	};
};

export type UploadProfilePictureDTO = z.infer<typeof uploadProfilePictureDTO>;

export type AuthDTO = z.infer<typeof authDTO>;
