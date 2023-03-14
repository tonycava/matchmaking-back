import { z } from 'zod';

export const authDTO = z.object({
	username: z.string().min(1, { message: 'Username is required' }),
	password: z.string().min(1, { message: 'Password is required' }),
});

export const decodeDTO = z.object({
	token: z.string().min(1, { message: 'Token is required' }),
});
export type AuthDTO = z.infer<typeof authDTO>;

export type DecodeDTO = z.infer<typeof decodeDTO>;