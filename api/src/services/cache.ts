import { PushTokenType } from '@prisma/client';

export default class CacheService {
	shopperPushTokens: Map<string, string>;
	merchantPushTokens: Map<string, string>;
	storeManagers: Map<string, Set<string>>;

	public registerPushToken(
		userId: string,
		pushToken: string,
		type: PushTokenType
	) {
		if (type === PushTokenType.Shopper) {
			this.shopperPushTokens.set(userId, pushToken);
		} else {
			this.merchantPushTokens.set(userId, pushToken);
		}
	}

	public getPushToken(userId: string, type: PushTokenType) {
		if (type === PushTokenType.Shopper) {
			return this.shopperPushTokens.get(userId);
		} else {
			return this.merchantPushTokens.get(userId);
		}
	}

	public registerStoreManager(storeId: string, userId: string) {
		const managers = this.storeManagers.get(storeId);

		if (!managers) {
			this.storeManagers.set(storeId, new Set([userId]));
		} else {
			managers.add(userId);
		}
	}

	public isStoreManager(storeId: string, userId: string) {
		return this.storeManagers.get(storeId)?.has(userId) ?? false;
	}
}
