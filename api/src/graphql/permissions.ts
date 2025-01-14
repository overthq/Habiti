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
		if (!args[2].user?.id) {
			throw new Error('Not authenticated');
		}

		return resolver(...args);
	};

export const storeAuthorizedResolver =
	<T>(resolver: Resolver<T>) =>
	async (...args: Parameters<Resolver<T>>) => {
		if (!args[2].user?.id) {
			throw new Error('Not authenticated');
		}

		if (!args[2].storeId) {
			throw new Error('Store not found');
		}

		const isAuthorized = await canManageStore(args[2].user.id, args[2].storeId);

		if (!isAuthorized) {
			throw new Error('Not authorized to manage store');
		}

		return resolver(...args);
	};
