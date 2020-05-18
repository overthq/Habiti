import { Order } from '../models';

export const placeOrder = async (_, { storeId, cart }, { user }) => {
	if (!user) {
		throw new Error('You are not authenticated');
	}

	if (user.role !== 'user') {
		throw new Error('You are not authorized to access this resource');
	}

	const newOrder = await Order.create({ userId: user.id, storeId, cart });
	return newOrder.populate('user store');
};
