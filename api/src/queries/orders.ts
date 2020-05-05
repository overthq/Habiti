import { Order } from '../models';

export const userOrders = async (_, { userId }) => {
	const allUserOrders = await Order.find({ userId });
	return allUserOrders;
};

export const storeOrders = async (_, { storeId }) => {
	// Make sure that the user accessing this is authorized to do so.
	const allStoreOrders = await Order.find({ storeId });
	// Run populate if the fields are requested
	return allStoreOrders;
};
