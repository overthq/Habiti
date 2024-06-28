interface StoreCacheData {
	managers: string[];
}

export default class CacheService {
	storeCache: Record<string, StoreCacheData>;

	public isStoreManager(storeId: string, userId: string) {
		return this.storeCache[storeId]?.managers.includes(userId) ?? false;
	}
}
