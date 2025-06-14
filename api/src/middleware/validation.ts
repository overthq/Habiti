import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';

import { APIException } from '../routes/types';

/**
 * Creates an Express middleware that validates the request body against a Zod schema.
 * If validation fails, it returns a 400 error with validation details.
 * If validation passes, it continues to the next middleware.
 *
 * @param schema - The Zod schema to validate against
 * @returns Express middleware function
 */
export const validateBody = <T extends ZodSchema>(schema: T) => {
	return (req: Request, _: Response, next: NextFunction) => {
		try {
			const result = schema.safeParse(req.body);

			if (!result.success) {
				const errors = result.error.errors.map(error => ({
					field: error.path.join('.'),
					message: error.message,
					code: error.code
				}));

				throw new APIException(400, 'Validation failed', errors);
			}

			// Optionally, you can add the validated data to the request
			// req.validatedBody = result.data;

			next();
		} catch (error) {
			if (error instanceof APIException) {
				next(error);
			} else {
				next(new APIException(400, 'Invalid request body'));
			}
		}
	};
};

/**
 * Creates an Express middleware that validates query parameters against a Zod schema.
 * If validation fails, it returns a 400 error with validation details.
 * If validation passes, it continues to the next middleware.
 *
 * @param schema - The Zod schema to validate against
 * @returns Express middleware function
 */
export const validateQuery = <T extends ZodSchema>(schema: T) => {
	return (req: Request, _: Response, next: NextFunction) => {
		try {
			const result = schema.safeParse(req.query);

			if (!result.success) {
				const errors = result.error.errors.map(error => ({
					field: error.path.join('.'),
					message: error.message,
					code: error.code
				}));

				throw new APIException(400, 'Invalid query parameters', errors);
			}

			next();
		} catch (error) {
			if (error instanceof APIException) {
				next(error);
			} else {
				next(new APIException(400, 'Invalid query parameters'));
			}
		}
	};
};

/**
 * Creates an Express middleware that validates URL parameters against a Zod schema.
 * If validation fails, it returns a 400 error with validation details.
 * If validation passes, it continues to the next middleware.
 *
 * @param schema - The Zod schema to validate against
 * @returns Express middleware function
 */
export const validateParams = <T extends ZodSchema>(schema: T) => {
	return (req: Request, _: Response, next: NextFunction) => {
		try {
			const result = schema.safeParse(req.params);

			if (!result.success) {
				const errors = result.error.errors.map(error => ({
					field: error.path.join('.'),
					message: error.message,
					code: error.code
				}));

				throw new APIException(400, 'Invalid URL parameters', errors);
			}

			next();
		} catch (error) {
			if (error instanceof APIException) {
				next(error);
			} else {
				next(new APIException(400, 'Invalid URL parameters'));
			}
		}
	};
};
