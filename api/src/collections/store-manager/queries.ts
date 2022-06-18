import { Resolver } from '../../types/resolvers';

const id: Resolver = parent => {
	return `${parent.storeId}-${parent.managerId}`;
};

const store: Resolver = async (parent, _, ctx) => {
	const fetchedStore = await ctx.prisma.storeManager
		.findUnique({
			where: {
				storeId_managerId: {
					storeId: parent.storeId,
					managerId: parent.managerId
				}
			}
		})
		.store();

	return fetchedStore;
};

const manager: Resolver = async (parent, _, ctx) => {
	const fetchedManager = await ctx.prisma.storeManager
		.findUnique({
			where: {
				storeId_managerId: {
					storeId: parent.storeId,
					managerId: parent.managerId
				}
			}
		})
		.manager();

	return fetchedManager;
};

export default {
	StoreManager: {
		id,
		store,
		manager
	}
};
