import { SafeParseReturnType } from 'zod';
import jwt from 'jsonwebtoken';

export const formatZodParseResponse = <Input = any, Output = any>(
	error: SafeParseReturnType<Input, Output>,
): string[] => {
	if (error.success) return [];
	const errors = error.error.errors;
	return errors.map((error) => error.message);
};

export const formatZodParseResponseOneLine = <Input = any, Output = any>(
	error: SafeParseReturnType<Input, Output>,
	separator = ';',
): string => {
	return formatZodParseResponse(error).join(separator);
};

export const signToken = (id: string, username: string, createdAt: Date): string => {
	return jwt.sign({ id, username, createdAt }, process.env.JWT_SECRET ?? '', { expiresIn: '7d' });
};
