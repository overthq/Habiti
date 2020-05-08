import { Manager } from '../models';

export const storeManagers = async (_, { storeId }) => {
	const allStoreManagers = await Manager.find({ storeId });
	return allStoreManagers;
};
