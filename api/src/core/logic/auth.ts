import argon2 from 'argon2';
import { z } from 'zod';

const registerBodySchema = z.object({
	name: z.string(),
	email: z.string().email(),
	password: z.string()
});

const authenticateBodySchema = z.object({
	email: z.string().email(),
	password: z.string()
});

export const validateRegisterBody = (body: any) => {
	const { success, data, error } = registerBodySchema.safeParse(body);

	if (!success) {
		throw new Error(error.message);
	}

	return data;
};

export const validateAuthenticateBody = (body: any) => {
	const { success, data, error } = authenticateBodySchema.safeParse(body);

	if (!success) {
		throw new Error(error.message);
	}

	return data;
};

export const verifyPassword = async (password: string, hash: string) => {
	return argon2.verify(hash, password);
};

export const hashPassword = async (password: string) => {
	return argon2.hash(password);
};
