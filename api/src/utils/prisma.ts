import { PrismaClient, Prisma } from '../generated/prisma/client';
import type { TransactionClient } from '../generated/prisma/internal/prismaNamespace';

const SERIALIZATION_FAILURE_CODES = new Set(['P2034', '40001', '40P01']);

const isSerializationFailure = (error: unknown): boolean => {
	const code = (error as { code?: string } | null)?.code;
	return typeof code === 'string' && SERIALIZATION_FAILURE_CODES.has(code);
};

const BACKOFF_MS = [50, 100, 200];

export const runSerializable = async <T>(
	prisma: PrismaClient,
	fn: (tx: TransactionClient) => Promise<T>
): Promise<T> => {
	let lastError: unknown;

	for (let attempt = 0; attempt <= BACKOFF_MS.length; attempt++) {
		try {
			return await prisma.$transaction(fn, {
				isolationLevel: Prisma.TransactionIsolationLevel.Serializable
			});
		} catch (error) {
			lastError = error;
			if (!isSerializationFailure(error) || attempt === BACKOFF_MS.length) {
				throw error;
			}
			await new Promise(resolve => setTimeout(resolve, BACKOFF_MS[attempt]));
		}
	}

	throw lastError;
};
