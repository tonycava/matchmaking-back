import { SafeParseReturnType } from 'zod';

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
