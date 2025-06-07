import { PushTokenType } from '@prisma/client';

import prismaClient from '../config/prisma';

// TODO: These should be cached in redis.

export const getUserPushTokens = async (userId: string) => {
	const user = await prismaClient.user.findUnique({
		where: { id: userId },
		include: { pushTokens: { where: { type: PushTokenType.Shopper } } }
	});

	return user?.pushTokens.map(token => token.token) ?? [];
};

export const getStorePushTokens = async (storeId: string) => {
	const managers = await prismaClient.storeManager.findMany({
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
