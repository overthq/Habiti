import { Resolver } from '../../types/resolvers';

interface AddStoreManagerArgs {
	input: {
		storeId: string;
		managerId: string;
	};
}

const addStoreManager: Resolver<AddStoreManagerArgs> = async (
	_parent,
	args,
	ctx
) => {
	return ctx.prisma.storeManager.create({
		data: {
			storeId: args.input.storeId,
			managerId: args.input.managerId
		}
	});
};

interface RemoveStoreManagerArgs {
	managerId: string;
}

const removeStoreManager: Resolver<RemoveStoreManagerArgs> = async (
	_parent,
	args,
	ctx
) => {
	if (!ctx.storeId) {
		throw new Error('No storeId specified');
	}

	return ctx.prisma.storeManager.delete({
		where: {
			storeId_managerId: {
				storeId: ctx.storeId,
				managerId: args.managerId
			}
		}
	});
};

export default {
	Mutation: {
		addStoreManager,
		removeStoreManager
	}
};
