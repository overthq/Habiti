import { Manager } from '../models';

export const storeManagers = async (_, { storeId }) => {
	const allStoreManagers = await Manager.find({ storeId });
	return allStoreManagers;
};

export const currentManager = async (_, __, { user }) => {
	if (!user) throw new Error('You are not authenticated');
	if (user.role !== 'manager') {
		throw new Error('You do not have the appropriate role');
	}

	const authenticatedManager = await Manager.findById(user.id);
	if (!authenticatedManager) throw new Error('Specified user does not exist');

	return authenticatedManager;
};
