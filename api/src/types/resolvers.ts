import { PrismaClient, User } from '@prisma/client';

export interface ResolverContext {
	prisma: PrismaClient;
	user: User | null;
}

export type Resolver<K = any, R = any> = (
	parent: any,
	args: K,
	ctx: ResolverContext,
	info: any
) => R;
