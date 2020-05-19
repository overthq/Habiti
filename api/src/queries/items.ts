import { Item } from '../models';

export const storeItems = async (_, { storeId }) => {
	console.log('storeId', storeId);
	const allStoreItems = await Item.find({ storeId });
	return allStoreItems;
};
