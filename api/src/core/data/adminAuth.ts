import { PrismaClient } from '../../generated/prisma/client';

interface CreateAdminRefreshTokenData {
	id: string;
	adminId: string;
	hashedToken: string;
	expiresAt: Date;
	sessionId: string;
}

export const createAdminRefreshToken = async (
	prisma: PrismaClient,
	data: CreateAdminRefreshTokenData
) => prisma.adminRefreshToken.create({ data });

export const getAdminRefreshTokenById = async (
	prisma: PrismaClient,
	id: string
) => {
	return prisma.adminRefreshToken.findUnique({
		where: { id },
		include: { admin: true }
	});
};

export const revokeAdminRefreshToken = async (
	prisma: PrismaClient,
	id: string
) => {
	return prisma.adminRefreshToken.update({
		where: { id },
		data: { revoked: true }
	});
};

export const revokeAdminRefreshTokens = async (
	prisma: PrismaClient,
	adminId: string
) => {
	return prisma.adminRefreshToken.updateMany({
		where: { adminId },
		data: { revoked: true }
	});
};

export const revokeAdminSessionRefreshTokens = async (
	prisma: PrismaClient,
	sessionId: string
) => {
	return prisma.adminRefreshToken.updateMany({
		where: { sessionId },
		data: { revoked: true }
	});
};
