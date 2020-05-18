import { Store } from '../models';

export const store = async (_, { storeId }) => {
	const matchedStore = await Store.findById(storeId);
	if (!matchedStore) throw new Error('Specified store does not exist');

	return matchedStore;
};

export const stores = async () => {
	const allStores = await Store.find();
	return allStores;
};
