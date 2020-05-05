import { Item } from '../models';

export const storeItems = async (_, { storeId }) => {
	const items = await Item.find({ storeId });
	return items;
};
