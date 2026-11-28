import { notFound } from '@tanstack/react-router';
import { isAxiosError } from 'axios';

export { cn } from 'cn';

export const notFoundOn404 = (error: unknown): never => {
	if (isAxiosError(error) && error.response?.status === 404) {
		throw notFound();
	}

	throw error;
};
