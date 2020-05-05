import { Store } from '../models';

export const stores = async () => {
	const allStores = await Store.find();
	return allStores;
};
