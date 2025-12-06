import { PrismaClient } from '../../generated/prisma/client';

interface CreateRefreshTokenData {
	id: string;
	userId: string;
	hashedToken: string;
	expiresAt: Date;
	sessionId: string;
}

export const createRefreshToken = async (
	prisma: PrismaClient,
	data: CreateRefreshTokenData
) => prisma.refreshToken.create({ data });

export const getRefreshTokenById = async (prisma: PrismaClient, id: string) => {
	return prisma.refreshToken.findUnique({
		where: { id },
		include: { user: true }
	});
};

export const updateRefreshToken = async (
	prisma: PrismaClient,
	id: string,
	data: { revoked: boolean }
) => {
	return prisma.refreshToken.update({
		where: { id },
		data
	});
};

export const revokeRefreshToken = async (prisma: PrismaClient, id: string) => {
	return updateRefreshToken(prisma, id, { revoked: true });
};

export const revokeUserRefreshTokens = async (
	prisma: PrismaClient,
	userId: string
) => {
	return prisma.refreshToken.updateMany({
		where: { userId },
		data: { revoked: true }
	});
};

export const revokeSessionRefreshTokens = async (
	prisma: PrismaClient,
	sessionId: string
) => {
	return prisma.refreshToken.updateMany({
		where: { sessionId },
		data: { revoked: true }
	});
};
