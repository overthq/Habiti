import { PrismaClient, User } from '@prisma/client';

export interface ResolverContext {
	prisma: PrismaClient;
	user: User | null;
}
