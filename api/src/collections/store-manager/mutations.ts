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
	const manager = await ctx.prisma.storeManager.create({
		data: {
			storeId: args.input.storeId,
			managerId: args.input.managerId
		}
	});

	return manager;
};

interface RemoveStoreManagerArgs {
	storeId: string;
	managerId: string;
}

const removeStoreManager: Resolver<RemoveStoreManagerArgs> = async (
	_parent,
	args,
	ctx
) => {
	const manager = await ctx.prisma.storeManager.delete({
		where: {
			storeId_managerId: {
				storeId: args.storeId,
				managerId: args.managerId
			}
		}
	});

	return manager;
};

export default {
	Mutation: {
		addStoreManager,
		removeStoreManager
	}
};
