import type { Context } from 'hono';
import type { ZodError } from 'zod';

type ValidationResult =
	| { success: true; data: any }
	| { success: false; error: ZodError };

export const zodHook = (result: ValidationResult, c: Context) => {
	if (!result.success) {
		const errors = result.error.errors.map(error => ({
			field: error.path.join('.'),
			message: error.message,
			code: error.code
		}));

		return c.json({ message: 'Validation failed', errors }, 400);
	}
};
