import { PrismaClient, PushTokenType } from '../../generated/prisma/client';

// TODO: These should be cached in redis.

export const getUserPushTokens = async (
	prisma: PrismaClient,
	userId: string
) => {
	const user = await prisma.user.findUnique({
		where: { id: userId },
		include: { pushTokens: { where: { type: PushTokenType.Shopper } } }
	});

	return user?.pushTokens.map(token => token.token) ?? [];
};

export const getStorePushTokens = async (
	prisma: PrismaClient,
	storeId: string
) => {
	const managers = await prisma.storeManager.findMany({
		where: { storeId },
		include: {
			manager: {
				include: {
					pushTokens: { where: { type: PushTokenType.Merchant } }
				}
			}
		}
	});

	return managers
		.map(m => m.manager.pushTokens[0]?.token)
		.filter(Boolean) as string[];
};
