import dotenv from 'dotenv';

dotenv.config();

// TODO: Use zod to validate the environment variables

export const env = {
	LOOPS_API_KEY: process.env.LOOPS_API_KEY || '',
	POSTHOG_API_KEY: process.env.POSTHOG_API_KEY || ''
};
