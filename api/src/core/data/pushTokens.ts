import { PrismaClient, PushTokenType } from '../../generated/prisma/client';

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
