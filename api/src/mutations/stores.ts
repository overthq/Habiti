import { Store } from '../models';

export const createStore = async (_, { input }) => {
	const store = await Store.create(input);
	return store;
};
