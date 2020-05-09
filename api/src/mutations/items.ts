import { Item, Manager } from '../models';

export const createItem = async (_, { input }, { user }) => {
	if (!user) throw new Error('');
	if (user.role !== 'manager') {
		throw new Error('');
	}

	const manager = await Manager.findById(user.id);
	if (!manager) {
		throw new Error('');
	}
	const item = await Item.create({ storeId: manager.storeId, ...input });
	return item;
};

export const updateItem = async (_, { storeId, itemId, input }) => {
	const item = await Item.updateOne({ itemId, storeId }, input);
	return item;
};
