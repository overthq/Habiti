import { Resolver } from '../../types/resolvers';

const id: Resolver = parent => {
	return `${parent.storeId}-${parent.managerId}`;
};

const store: Resolver = async (parent, _, ctx) => {
	return ctx.prisma.storeManager
		.findUnique({
			where: {
				storeId_managerId: {
					storeId: parent.storeId,
					managerId: parent.managerId
				}
			}
		})
		.store();
};

const manager: Resolver = async (parent, _, ctx) => {
	return ctx.prisma.storeManager
		.findUnique({
			where: {
				storeId_managerId: {
					storeId: parent.storeId,
					managerId: parent.managerId
				}
			}
		})
		.manager();
};

export default {
	StoreManager: {
		id,
		store,
		manager
	}
};
