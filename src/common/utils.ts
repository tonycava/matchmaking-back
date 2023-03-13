import { SafeParseError, SafeParseReturnType } from 'zod';
export const formatZodParseResponse = <Input = any, Output = any>(
	error: SafeParseReturnType<Input, Output>,
): string[] => {
	if (error.success) return [];
	return (error as SafeParseError<Input>).error.issues.map((issue) => {
		return `${issue.path.join('.')} : ${issue.message.toLowerCase()}`;
	});
};

export const formatZodParseResponseOneLine = <Input = any, Output = any>(
	error: SafeParseReturnType<Input, Output>,
	separator = ';',
): string => {
	return formatZodParseResponse(error).join(separator);
};
