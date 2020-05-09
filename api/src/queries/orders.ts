import { Order, Manager } from '../models';

export const userOrders = async (_, __, { user }) => {
	if (!user) throw new Error('User is not authenticated');
	if (user.role !== 'user') {
		throw new Error('You are not authorized to view this resource.');
	}

	const allUserOrders = await Order.find({ userId: user.id });
	return allUserOrders;
};

export const storeOrders = async (_, __, { user }) => {
	// Make sure that the user accessing this is authorized to do so.
	if (!user) throw new Error('User is not authenticated');
	if (user.role !== 'user') {
		throw new Error('You are not authorized to view this resource.');
	}

	const manager = await Manager.findById(user.id);
	if (!manager) throw new Error('Specified manager does not exist');

	const allStoreOrders = await Order.find({ storeId: manager.storeId });
	// Run populate if the fields are requested
	return allStoreOrders;
};
