import { z } from 'zod';

export const authDTO = z.object({
	username: z.string().min(1, { message: 'Username is required' }),
	password: z.string().min(1, { message: 'Password is required' }),
});

export type AuthDTO = z.infer<typeof authDTO>;

export type Range = {
	start: string;
	end: string;
};
