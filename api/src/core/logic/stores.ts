import type { Context } from 'hono';

import type { AppEnv } from '../../types/hono';
import type { StripUndefined } from '../../utils/objects';

import * as PushTokenData from '../data/pushTokens';
import * as StoreData from '../data/stores';
import { createTransferReceipient } from '../payments';

import { NotificationType } from '../notifications';

import { OrderFilters, ProductFilters } from '../../utils/queries';
import { canManageStore } from './permissions';

import { LogicError, LogicErrorCode } from './errors';

interface CreateStoreInput {
	name: string;
	description?: string | undefined;
	website?: string | undefined;
	twitter?: string | undefined;
	instagram?: string | undefined;
	bankAccountNumber?: string | undefined;
	bankCode?: string | undefined;
	bankAccountReference?: string | undefined;
}

export const createStore = async (
	c: Context<AppEnv>,
	input: CreateStoreInput
) => {
	if (!c.var.auth?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	const store = await StoreData.createStore(c.var.prisma, {
		...(input as StripUndefined<CreateStoreInput>),
		userId: c.var.auth.id
	});

	c.var.services.analytics.track({
		event: 'store_created',
		distinctId: c.var.auth.id,
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
	name?: string | undefined;
	description?: string | undefined;
	website?: string | undefined;
	twitter?: string | undefined;
	instagram?: string | undefined;
	bankAccountNumber?: string | undefined;
	bankCode?: string | undefined;
	bankAccountReference?: string | undefined;
	unlisted?: boolean | undefined;
	imageUrl?: string | undefined;
	imagePublicId?: string | undefined;
}

export const updateStore = async (
	c: Context<AppEnv>,
	input: UpdateStoreInput
) => {
	const { storeId, ...updateData } = input;

	if (c.var.storeId && c.var.storeId !== storeId) {
		throw new LogicError(LogicErrorCode.CannotManageStore);
	}

	const existingStore = await StoreData.getStoreByIdWithManagers(
		c.var.prisma,
		storeId
	);

	if (!existingStore) {
		throw new LogicError(LogicErrorCode.StoreNotFound);
	}

	if (!c.var.auth) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	const isAuthorized = await canManageStore(c);

	if (!isAuthorized) {
		throw new LogicError(LogicErrorCode.Forbidden);
	}

	if (updateData.bankAccountNumber && updateData.bankCode) {
		const { data, status } = await createTransferReceipient({
			name: c.var.auth.name,
			accountNumber: updateData.bankAccountNumber,
			bankCode: updateData.bankCode
		});

		if (status) {
			updateData.bankAccountNumber = data.details.account_number;
			updateData.bankCode = data.details.bank_code;
			updateData.bankAccountReference = data.recipient_code;
		}
	} else {
		// FIXME: If (and only if) the user explicitly unset bank details, set them to
		// undefined.
		// updateData.bankAccountNumber = undefined;
		// updateData.bankCode = undefined;
		// updateData.bankAccountReference = undefined;
	}

	const store = await StoreData.updateStore(
		c.var.prisma,
		storeId,
		updateData as StripUndefined<typeof updateData>
	);

	c.var.services.analytics.track({
		event: 'store_updated',
		distinctId: c.var.auth.id,
		properties: {
			storeId: store.id,
			storeName: store.name,
			updatedFields: Object.keys(updateData)
		},
		groups: { store: storeId }
	});

	return store;
};

export const getStoreById = async (c: Context<AppEnv>, storeId: string) => {
	const store = await StoreData.getStoreByIdWithProducts(c.var.prisma, storeId);

	if (!store) {
		throw new LogicError(LogicErrorCode.StoreNotFound);
	}

	const storeViewerContext = c.var.auth?.id
		? await StoreData.getStoreViewerContext(
				c.var.prisma,
				c.var.auth.id,
				store.id
			)
		: null;

	if (c.var.auth?.id) {
		c.var.services.analytics.track({
			event: 'store_viewed',
			distinctId: c.var.auth.id,
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

export const deleteStore = async (
	c: Context<AppEnv>,
	input: DeleteStoreInput
) => {
	const { storeId } = input;

	const store = await StoreData.getStoreByIdWithManagers(c.var.prisma, storeId);

	if (!store) {
		throw new LogicError(LogicErrorCode.StoreNotFound);
	}

	if (!c.var.auth) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	const currentUserId = c.var.auth.id;

	const isCurrentUserManager = store.managers.some(
		m => m.managerId === currentUserId
	);

	if (!isCurrentUserManager) {
		throw new LogicError(LogicErrorCode.CannotManageStore);
	}

	await StoreData.deleteStore(c.var.prisma, storeId);

	c.var.services.analytics.track({
		event: 'store_deleted',
		distinctId: c.var.auth.id,
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
	c: Context<AppEnv>,
	input: CreateStoreManagerInput
) => {
	const { storeId, userId } = input;

	const store = await StoreData.getStoreByIdWithManagers(c.var.prisma, storeId);

	if (!store) {
		throw new LogicError(LogicErrorCode.StoreNotFound);
	}

	if (!c.var.auth) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	const currentUserId = c.var.auth.id;

	const isCurrentUserManager = store.managers.some(
		m => m.managerId === currentUserId
	);

	if (!isCurrentUserManager) {
		throw new LogicError(LogicErrorCode.CannotManageStore);
	}

	const manager = await StoreData.createStoreManager(c.var.prisma, {
		storeId,
		userId
	});

	c.var.services.analytics.track({
		event: 'store_manager_added',
		distinctId: c.var.auth.id,
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
	c: Context<AppEnv>,
	input: RemoveStoreManagerInput
) => {
	const { storeId, userId } = input;

	const store = await StoreData.getStoreByIdWithManagers(c.var.prisma, storeId);

	if (!store) {
		throw new LogicError(LogicErrorCode.StoreNotFound);
	}

	if (!c.var.auth) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	const currentUserId = c.var.auth.id;

	const isCurrentUserManager = store.managers.some(
		m => m.managerId === currentUserId
	);

	if (!isCurrentUserManager) {
		throw new LogicError(LogicErrorCode.CannotManageStore);
	}

	if (store.managers.length <= 1) {
		throw new LogicError(LogicErrorCode.CannotRemoveLastManager);
	}

	await StoreData.removeStoreManager(c.var.prisma, storeId, userId);

	c.var.services.analytics.track({
		event: 'store_manager_removed',
		distinctId: c.var.auth.id,
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

export const followStore = async (
	c: Context<AppEnv>,
	input: FollowStoreInput
) => {
	const { storeId } = input;

	const store = await StoreData.getStoreByIdWithFollowers(
		c.var.prisma,
		storeId
	);

	if (!store) {
		throw new LogicError(LogicErrorCode.StoreNotFound);
	}

	if (!c.var.auth) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	const currentUserId = c.var.auth.id;

	const isAlreadyFollowing = store.followers.some(
		f => f.followerId === currentUserId
	);

	if (isAlreadyFollowing) {
		throw new LogicError(LogicErrorCode.AlreadyFollowing);
	}

	const follower = await StoreData.followStore(c.var.prisma, {
		storeId,
		userId: c.var.auth.id
	});

	const pushTokens = await PushTokenData.getStorePushTokens(
		c.var.prisma,
		storeId
	);

	for (const pushToken of pushTokens) {
		if (pushToken) {
			c.var.services.notifications.queueNotification({
				type: NotificationType.NewFollower,
				data: { followerName: c.var.auth.name },
				recipientTokens: [pushToken]
			});
		}
	}

	c.var.services.analytics.track({
		event: 'store_followed',
		distinctId: c.var.auth.id,
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
	c: Context<AppEnv>,
	input: UnfollowStoreInput
) => {
	const { storeId } = input;

	const store = await StoreData.getStoreByIdWithFollowers(
		c.var.prisma,
		storeId
	);

	if (!store) {
		throw new LogicError(LogicErrorCode.StoreNotFound);
	}

	if (!c.var.auth?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	const currentUserId = c.var.auth.id;

	const isFollowing = store.followers.some(f => f.followerId === currentUserId);

	if (!isFollowing) {
		throw new LogicError(LogicErrorCode.NotFollowing);
	}

	const follower = await StoreData.unfollowStore(c.var.prisma, {
		storeId,
		userId: c.var.auth.id
	});

	c.var.services.analytics.track({
		event: 'store_unfollowed',
		distinctId: c.var.auth.id,
		properties: {
			storeId,
			storeName: store.name
		},
		groups: { store: storeId }
	});

	return follower;
};

export const getStoresByUserId = async (c: Context<AppEnv>, userId: string) => {
	if (!c.var.auth?.id || userId !== c.var.auth.id) {
		throw new LogicError(LogicErrorCode.Forbidden);
	}

	return StoreData.getStoresByUserId(c.var.prisma, userId);
};

export const getFollowedStores = async (c: Context<AppEnv>, userId: string) => {
	if (!c.var.auth?.id || userId !== c.var.auth.id) {
		throw new LogicError(LogicErrorCode.Forbidden);
	}

	return StoreData.getFollowedStores(c.var.prisma, userId);
};

export const getStores = async (c: Context<AppEnv>, query: any) => {
	return StoreData.getStores(c.var.prisma, query);
};

export const getStoreManagers = async (
	c: Context<AppEnv>,
	storeId: string,
	query: any
) => {
	return StoreData.getStoreManagers(c.var.prisma, storeId, query);
};

export const getStoreProducts = async (
	c: Context<AppEnv>,
	storeId: string,
	filters?: ProductFilters
) => {
	return StoreData.getStoreProducts(c.var.prisma, storeId, filters);
};

export const getStoreOrders = async (
	c: Context<AppEnv>,
	storeId: string,
	filters?: OrderFilters
) => {
	return StoreData.getStoreOrders(c.var.prisma, storeId, filters);
};

export const getStoreCustomer = async (
	c: Context<AppEnv>,
	storeId: string,
	userId: string
) => {
	await canManageStore(c);

	const customer = await StoreData.getStoreCustomer(
		c.var.prisma,
		storeId,
		userId
	);

	if (!customer) {
		throw new LogicError(LogicErrorCode.UserNotFound, 'Customer not found');
	}

	return customer;
};

export const getTrendingStores = async (
	c: Context<AppEnv>,
	options: StoreData.GetTrendingStoresOptions = {}
) => {
	return StoreData.getTrendingStores(c.var.prisma, options);
};
