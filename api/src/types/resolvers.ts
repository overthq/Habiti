import { PrismaClient } from '@prisma/client';

export interface ResolverContext {
	prisma: PrismaClient;
}
