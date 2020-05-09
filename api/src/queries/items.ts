import { Item, Manager } from '../models';

export const storeItems = async (_, __, { user }) => {
	if (!user) throw new Error('User is not authenticated');
	if (user.role !== 'user') {
		throw new Error('You are not authorized to view this resource.');
	}

	const manager = await Manager.findById(user.id);
	if (!manager) throw new Error('Specified manager does not exist');

	const allStoreItems = await Item.find({ storeId: manager.storeId });
	return allStoreItems;
};
