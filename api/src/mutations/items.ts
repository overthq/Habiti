import { Item } from '../models';

export const createItem = async (_, { storeId, input }) => {
	const item = await Item.create({ storeId, ...input });
	return item;
};

export const updateItem = async (_, { storeId, itemId, input }) => {
	const item = await Item.updateOne({ itemId, storeId }, input);
	return item;
};
