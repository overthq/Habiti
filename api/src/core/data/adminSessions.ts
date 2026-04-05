import { PrismaClient } from '../../generated/prisma/client';

interface CreateAdminSessionInput {
	adminId: string;
	userAgent?: string | undefined;
	ipAddress?: string | undefined;
}

export const createAdminSession = async (
	prisma: PrismaClient,
	input: CreateAdminSessionInput
) =>
	prisma.adminSession.create({
		data: {
			adminId: input.adminId,
			userAgent: input.userAgent ?? null,
			ipAddress: input.ipAddress ?? null
		}
	});

export const getAdminSessionById = async (prisma: PrismaClient, id: string) => {
	return prisma.adminSession.findUnique({
		where: { id },
		include: { admin: true }
	});
};

export const revokeAdminSession = async (prisma: PrismaClient, id: string) => {
	return prisma.$transaction([
		prisma.adminSession.update({
			where: { id },
			data: { revoked: true }
		}),
		prisma.adminRefreshToken.updateMany({
			where: { sessionId: id },
			data: { revoked: true }
		})
	]);
};

export const revokeAdminSessions = async (
	prisma: PrismaClient,
	adminId: string
) => {
	return prisma.$transaction([
		prisma.adminSession.updateMany({
			where: { adminId },
			data: { revoked: true }
		}),
		prisma.adminRefreshToken.updateMany({
			where: { adminId },
			data: { revoked: true }
		})
	]);
};

export const getAdminSessions = async (
	prisma: PrismaClient,
	adminId: string
) => {
	return prisma.adminSession.findMany({
		where: { adminId, revoked: false },
		orderBy: { lastActiveAt: 'desc' }
	});
};

export const updateAdminSessionActivity = async (
	prisma: PrismaClient,
	id: string
) => {
	return prisma.adminSession.update({
		where: { id },
		data: { lastActiveAt: new Date() }
	});
};
