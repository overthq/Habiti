import { PrismaClient } from '../../generated/prisma/client';

interface CreateSessionInput {
	userId: string;
	userAgent?: string | undefined;
	ipAddress?: string | undefined;
}

export const createSession = async (
	prisma: PrismaClient,
	input: CreateSessionInput
) => {
	return prisma.session.create({
		data: {
			userId: input.userId,
			userAgent: input.userAgent ?? null,
			ipAddress: input.ipAddress ?? null
		}
	});
};

export const getSessionById = async (prisma: PrismaClient, id: string) => {
	return prisma.session.findUnique({
		where: { id },
		include: { user: true }
	});
};

export const revokeSession = async (prisma: PrismaClient, id: string) => {
	return prisma.$transaction([
		prisma.session.update({
			where: { id },
			data: { revoked: true }
		}),
		prisma.refreshToken.updateMany({
			where: { sessionId: id },
			data: { revoked: true }
		})
	]);
};

export const revokeUserSessions = async (
	prisma: PrismaClient,
	userId: string
) => {
	return prisma.$transaction([
		prisma.session.updateMany({
			where: { userId },
			data: { revoked: true }
		}),
		prisma.refreshToken.updateMany({
			where: { userId },
			data: { revoked: true }
		})
	]);
};

export const getUserSessions = async (prisma: PrismaClient, userId: string) => {
	return prisma.session.findMany({
		where: { userId, revoked: false },
		orderBy: { lastActiveAt: 'desc' }
	});
};

export const updateSessionActivity = async (
	prisma: PrismaClient,
	id: string
) => {
	return prisma.session.update({
		where: { id },
		data: { lastActiveAt: new Date() }
	});
};
