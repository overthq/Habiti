import prismaClient from '../config/prisma';
import { Resolver } from '../types/resolvers';

export const canManageStore = async (managerId: string, storeId: string) => {
	const storeManager = await prismaClient.storeManager.findUnique({
		where: { storeId_managerId: { managerId, storeId } }
	});

	return !!storeManager;
};

export const authenticatedResolver =
	<T>(resolver: Resolver<T>) =>
	async (...args: Parameters<Resolver<T>>) => {
		const ctx = args[2];

		if (!ctx.user?.id) {
			throw new Error('Not authenticated');
		}

		return resolver(...args);
	};

export const storeAuthorizedResolver =
	<T>(resolver: Resolver<T>) =>
	async (...args: Parameters<Resolver<T>>) => {
		const ctx = args[2];

		if (!ctx.user.id) {
			throw new Error('Not authenticated');
		}

		if (!ctx.storeId) {
			throw new Error('Store not found');
		}

		const isAuthorized = await canManageStore(ctx.user.id, ctx.storeId);

		if (!isAuthorized) {
			throw new Error('Not authorized to manage store');
		}

		return resolver(...args);
	};
