import { PushTokenType } from '@prisma/client';

import prismaClient from '../config/prisma';

export const getPushTokensForStore = async (storeId: string) => {
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

	// TODO: Cache these tokenIds in the CacheService.
	return managers
		.map(m => m.manager.pushTokens[0]?.token)
		.filter(Boolean) as string[];
};
