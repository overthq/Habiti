import { Order } from '../models';

export const placeOrder = async (_, { userId, shopId, cart }) => {
	const newOrder = await Order.create({ userId, shopId, cart });
	return newOrder;
};
