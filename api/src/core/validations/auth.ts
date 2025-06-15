import z from 'zod';

export const registerBodySchema = z.object({
	name: z.string(),
	email: z.string().email(),
	password: z.string()
});

export const authenticateBodySchema = z.object({
	email: z.string().email(),
	password: z.string()
});
