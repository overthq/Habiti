import { AppContext } from '../../utils/context';

import * as PushTokenData from '../data/pushTokens';
import * as StoreData from '../data/stores';
import * as PayoutData from '../data/payouts';

import { NotificationType } from '../notifications';

import { ProductFilters } from '../../utils/queries';
import { canManageStore } from './permissions';

import { LogicError, LogicErrorCode } from './errors';

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

export const createStore = async (ctx: AppContext, input: CreateStoreInput) => {
	if (!ctx.user?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	const store = await StoreData.createStore(ctx.prisma, {
		...input,
		userId: ctx.user.id
	});

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
	imageUrl?: string;
	imagePublicId?: string;
}

export const updateStore = async (ctx: AppContext, input: UpdateStoreInput) => {
	const { storeId, ...updateData } = input;

	if (ctx.storeId && ctx.storeId !== storeId) {
		throw new LogicError(LogicErrorCode.CannotManageStore);
	}

	const existingStore = await StoreData.getStoreByIdWithManagers(
		ctx.prisma,
		storeId
	);

	if (!existingStore) {
		throw new LogicError(LogicErrorCode.StoreNotFound);
	}

	if (!ctx.user) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	const isAuthorized = await canManageStore(ctx);

	if (!isAuthorized) {
		throw new LogicError(LogicErrorCode.Forbidden);
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
	const store = await StoreData.getStoreByIdWithProducts(ctx.prisma, storeId);

	if (!store) {
		throw new LogicError(LogicErrorCode.StoreNotFound);
	}

	const storeViewerContext = ctx.user?.id
		? await StoreData.getStoreViewerContext(ctx.prisma, ctx.user.id, store.id)
		: null;

	if (ctx.user?.id) {
		ctx.services.analytics.track({
			event: 'store_viewed',
			distinctId: ctx.user.id,
			properties: {
				storeId: store.id,
				storeName: store.name
			},
			groups: { store: storeId }
		});
	}

	return { store, viewerContext: storeViewerContext };
};

interface DeleteStoreInput {
	storeId: string;
}

export const deleteStore = async (ctx: AppContext, input: DeleteStoreInput) => {
	const { storeId } = input;

	const store = await StoreData.getStoreByIdWithManagers(ctx.prisma, storeId);

	if (!store) {
		throw new LogicError(LogicErrorCode.StoreNotFound);
	}

	if (!ctx.user) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	const currentUserId = ctx.user.id;

	const isCurrentUserManager = store.managers.some(
		m => m.managerId === currentUserId
	);

	if (!isCurrentUserManager) {
		throw new LogicError(LogicErrorCode.CannotManageStore);
	}

	await StoreData.deleteStore(ctx.prisma, storeId);

	ctx.services.analytics.track({
		event: 'store_deleted',
		distinctId: ctx.user.id,
		properties: {
			storeId: store.id,
			storeName: store.name
		},
		groups: { store: storeId }
	});

	return store;
};

interface CreateStoreManagerInput {
	storeId: string;
	userId: string;
}

export const createStoreManager = async (
	ctx: AppContext,
	input: CreateStoreManagerInput
) => {
	const { storeId, userId } = input;

	const store = await StoreData.getStoreByIdWithManagers(ctx.prisma, storeId);

	if (!store) {
		throw new LogicError(LogicErrorCode.StoreNotFound);
	}

	if (!ctx.user) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	const currentUserId = ctx.user.id;

	const isCurrentUserManager = store.managers.some(
		m => m.managerId === currentUserId
	);

	if (!isCurrentUserManager) {
		throw new LogicError(LogicErrorCode.CannotManageStore);
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

interface RemoveStoreManagerInput {
	storeId: string;
	userId: string;
}

export const removeStoreManager = async (
	ctx: AppContext,
	input: RemoveStoreManagerInput
) => {
	const { storeId, userId } = input;

	const store = await StoreData.getStoreByIdWithManagers(ctx.prisma, storeId);

	if (!store) {
		throw new LogicError(LogicErrorCode.StoreNotFound);
	}

	if (!ctx.user) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	const currentUserId = ctx.user.id;

	const isCurrentUserManager = store.managers.some(
		m => m.managerId === currentUserId
	);

	if (!isCurrentUserManager) {
		throw new LogicError(LogicErrorCode.CannotManageStore);
	}

	if (store.managers.length <= 1) {
		throw new LogicError(LogicErrorCode.CannotRemoveLastManager);
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

interface FollowStoreInput {
	storeId: string;
}

export const followStore = async (ctx: AppContext, input: FollowStoreInput) => {
	const { storeId } = input;

	const store = await StoreData.getStoreByIdWithFollowers(ctx.prisma, storeId);

	if (!store) {
		throw new LogicError(LogicErrorCode.StoreNotFound);
	}

	if (!ctx.user) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	const currentUserId = ctx.user.id;

	const isAlreadyFollowing = store.followers.some(
		f => f.followerId === currentUserId
	);

	if (isAlreadyFollowing) {
		throw new LogicError(LogicErrorCode.AlreadyFollowing);
	}

	const follower = await StoreData.followStore(ctx.prisma, {
		storeId,
		userId: ctx.user.id
	});

	const pushTokens = await PushTokenData.getStorePushTokens(
		ctx.prisma,
		storeId
	);

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

interface UnfollowStoreInput {
	storeId: string;
}

export const unfollowStore = async (
	ctx: AppContext,
	input: UnfollowStoreInput
) => {
	const { storeId } = input;

	const store = await StoreData.getStoreByIdWithFollowers(ctx.prisma, storeId);

	if (!store) {
		throw new LogicError(LogicErrorCode.StoreNotFound);
	}

	if (!ctx.user?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	const currentUserId = ctx.user.id;

	const isFollowing = store.followers.some(f => f.followerId === currentUserId);

	if (!isFollowing) {
		throw new LogicError(LogicErrorCode.NotFollowing);
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
	if (!ctx.user?.id || userId !== ctx.user.id) {
		throw new LogicError(LogicErrorCode.Forbidden);
	}

	return StoreData.getStoresByUserId(ctx.prisma, userId);
};

export const getFollowedStores = async (ctx: AppContext, userId: string) => {
	if (!ctx.user?.id || userId !== ctx.user.id) {
		throw new LogicError(LogicErrorCode.Forbidden);
	}

	return StoreData.getFollowedStores(ctx.prisma, userId);
};

export const getStores = async (ctx: AppContext, query: any) => {
	return StoreData.getStores(ctx.prisma, query);
};

export const getStorePayouts = async (ctx: AppContext, storeId: string) => {
	return PayoutData.getStorePayouts(ctx.prisma, storeId);
};

export const getStoreManagers = async (
	ctx: AppContext,
	storeId: string,
	query: any
) => {
	return StoreData.getStoreManagers(ctx.prisma, storeId, query);
};

export const getStoreProducts = async (
	ctx: AppContext,
	storeId: string,
	filters?: ProductFilters
) => {
	return StoreData.getStoreProducts(ctx.prisma, storeId, filters);
};

export const getStoreOrders = async (
	ctx: AppContext,
	storeId: string,
	query: any
) => {
	return StoreData.getStoreOrders(ctx.prisma, storeId, query);
};

export const getStoreCustomer = async (
	ctx: AppContext,
	storeId: string,
	userId: string
) => {
	await canManageStore(ctx);

	const customer = await StoreData.getStoreCustomer(
		ctx.prisma,
		storeId,
		userId
	);

	if (!customer) {
		throw new LogicError(LogicErrorCode.UserNotFound, 'Customer not found');
	}

	return customer;
};

export const getTrendingStores = async (
	ctx: AppContext,
	options: StoreData.GetTrendingStoresOptions = {}
) => {
	return StoreData.getTrendingStores(ctx.prisma, options);
};
