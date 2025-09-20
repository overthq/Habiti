import * as StoreData from '../data/stores';
import { AppContext } from '../../utils/context';
import { getStorePushTokens, NotificationType } from '../notifications';

interface CreateStoreInput {
	name: string;
	description?: string;
	website?: string;
	twitter?: string;
	instagram?: string;
	bankAccountNumber?: string;
	bankCode?: string;
	bankAccountReference?: string;
}

interface UpdateStoreInput {
	storeId: string;
	name?: string;
	description?: string;
	website?: string;
	twitter?: string;
	instagram?: string;
	bankAccountNumber?: string;
	bankCode?: string;
	bankAccountReference?: string;
	unlisted?: boolean;
}

interface CreateStoreManagerInput {
	storeId: string;
	userId: string;
}

interface RemoveStoreManagerInput {
	storeId: string;
	userId: string;
}

interface FollowStoreInput {
	storeId: string;
}

interface UnfollowStoreInput {
	storeId: string;
}

interface DeleteStoreInput {
	storeId: string;
}

export const createStore = async (ctx: AppContext, input: CreateStoreInput) => {
	const store = await StoreData.createStore(ctx.prisma, input);

	ctx.services.analytics.track({
		event: 'store_created',
		distinctId: ctx.user.id,
		properties: {
			storeId: store.id,
			storeName: store.name,
			hasDescription: !!store.description,
			hasWebsite: !!store.website,
			hasSocialMedia: !!(store.twitter || store.instagram)
		},
		groups: { store: store.id }
	});

	return store;
};

export const updateStore = async (ctx: AppContext, input: UpdateStoreInput) => {
	const { storeId, ...updateData } = input;

	if (ctx.storeId && ctx.storeId !== storeId) {
		throw new Error('Unauthorized: Cannot update different store');
	}

	const existingStore = await StoreData.getStoreById(ctx.prisma, storeId);

	if (!existingStore) {
		throw new Error('Store not found');
	}

	const isManager = existingStore.managers.some(
		m => m.managerId === ctx.user.id
	);

	if (!isManager) {
		throw new Error('Unauthorized: User is not a manager of this store');
	}

	const store = await StoreData.updateStore(ctx.prisma, storeId, updateData);

	ctx.services.analytics.track({
		event: 'store_updated',
		distinctId: ctx.user.id,
		properties: {
			storeId: store.id,
			storeName: store.name,
			updatedFields: Object.keys(updateData)
		},
		groups: { store: storeId }
	});

	return store;
};

export const getStoreById = async (ctx: AppContext, storeId: string) => {
	const store = await StoreData.getStoreById(ctx.prisma, storeId);

	if (!store) {
		throw new Error('Store not found');
	}

	ctx.services.analytics.track({
		event: 'store_viewed',
		distinctId: ctx.user.id,
		properties: {
			storeId: store.id,
			storeName: store.name,
			productCount: store.products.length,
			followerCount: store.followers.length
		},
		groups: { store: storeId }
	});

	return store;
};

export const deleteStore = async (ctx: AppContext, input: DeleteStoreInput) => {
	const { storeId } = input;

	const store = await StoreData.getStoreById(ctx.prisma, storeId);

	if (!store) {
		throw new Error('Store not found');
	}

	const isManager = store.managers.some(m => m.managerId === ctx.user.id);

	if (!isManager) {
		throw new Error('Unauthorized: User is not a manager of this store');
	}

	await StoreData.deleteStore(ctx.prisma, storeId);

	ctx.services.analytics.track({
		event: 'store_deleted',
		distinctId: ctx.user.id,
		properties: {
			storeId: store.id,
			storeName: store.name,
			productCount: store.products.length,
			followerCount: store.followers.length
		},
		groups: { store: storeId }
	});

	return store;
};

export const createStoreManager = async (
	ctx: AppContext,
	input: CreateStoreManagerInput
) => {
	const { storeId, userId } = input;

	const store = await StoreData.getStoreById(ctx.prisma, storeId);

	if (!store) {
		throw new Error('Store not found');
	}

	const isCurrentUserManager = store.managers.some(
		m => m.managerId === ctx.user.id
	);

	if (!isCurrentUserManager) {
		throw new Error('Unauthorized: User is not a manager of this store');
	}

	const manager = await StoreData.createStoreManager(ctx.prisma, {
		storeId,
		userId
	});

	ctx.services.analytics.track({
		event: 'store_manager_added',
		distinctId: ctx.user.id,
		properties: {
			storeId,
			managerId: userId,
			storeName: store.name
		},
		groups: { store: storeId }
	});

	return manager;
};

export const removeStoreManager = async (
	ctx: AppContext,
	input: RemoveStoreManagerInput
) => {
	const { storeId, userId } = input;

	const store = await StoreData.getStoreById(ctx.prisma, storeId);

	if (!store) {
		throw new Error('Store not found');
	}

	const isCurrentUserManager = store.managers.some(
		m => m.managerId === ctx.user.id
	);

	if (!isCurrentUserManager) {
		throw new Error('Unauthorized: User is not a manager of this store');
	}

	if (store.managers.length <= 1) {
		throw new Error('Cannot remove the last manager from store');
	}

	await StoreData.removeStoreManager(ctx.prisma, storeId, userId);

	ctx.services.analytics.track({
		event: 'store_manager_removed',
		distinctId: ctx.user.id,
		properties: {
			storeId,
			removedManagerId: userId,
			storeName: store.name
		},
		groups: { store: storeId }
	});

	return { success: true };
};

export const followStore = async (ctx: AppContext, input: FollowStoreInput) => {
	const { storeId } = input;

	const store = await StoreData.getStoreById(ctx.prisma, storeId);

	if (!store) {
		throw new Error('Store not found');
	}

	const isAlreadyFollowing = store.followers.some(
		f => f.followerId === ctx.user.id
	);

	if (isAlreadyFollowing) {
		throw new Error('Already following this store');
	}

	const follower = await StoreData.followStore(ctx.prisma, {
		storeId,
		userId: ctx.user.id
	});

	const pushTokens = await getStorePushTokens(storeId);

	for (const pushToken of pushTokens) {
		if (pushToken) {
			ctx.services.notifications.queueNotification({
				type: NotificationType.NewFollower,
				data: { followerName: ctx.user.name },
				recipientTokens: [pushToken]
			});
		}
	}

	ctx.services.analytics.track({
		event: 'store_followed',
		distinctId: ctx.user.id,
		properties: {
			storeId,
			storeName: store.name
		},
		groups: { store: storeId }
	});

	return follower;
};

export const unfollowStore = async (
	ctx: AppContext,
	input: UnfollowStoreInput
) => {
	const { storeId } = input;

	const store = await StoreData.getStoreById(ctx.prisma, storeId);

	if (!store) {
		throw new Error('Store not found');
	}

	const isFollowing = store.followers.some(f => f.followerId === ctx.user.id);

	if (!isFollowing) {
		throw new Error('Not following this store');
	}

	const follower = await StoreData.unfollowStore(ctx.prisma, {
		storeId,
		userId: ctx.user.id
	});

	ctx.services.analytics.track({
		event: 'store_unfollowed',
		distinctId: ctx.user.id,
		properties: {
			storeId,
			storeName: store.name
		},
		groups: { store: storeId }
	});

	return follower;
};

export const getStoresByUserId = async (ctx: AppContext, userId: string) => {
	if (userId !== ctx.user.id) {
		throw new Error("Unauthorized: Cannot access other user's stores");
	}

	return StoreData.getStoresByUserId(ctx.prisma, userId);
};

export const getFollowedStores = async (ctx: AppContext, userId: string) => {
	if (userId !== ctx.user.id) {
		throw new Error("Unauthorized: Cannot access other user's followed stores");
	}

	return StoreData.getFollowedStores(ctx.prisma, userId);
};
