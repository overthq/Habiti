import z from 'zod';

export const registerBodySchema = z.object({
	name: z.string(),
	email: z.string().email()
});

export const authenticateBodySchema = z.object({
	email: z.string().email()
});

export const verifyCodeBodySchema = z.object({
	email: z.string().email(),
	code: z.string() // TODO: Harden this to be a string of 6 numbers
});
