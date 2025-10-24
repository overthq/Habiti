import { RequestHandler } from 'express';

import prismaClient from '../config/prisma';
import { hydrateQuery } from '../utils/queries';
import * as OrderLogic from '../core/logic/orders';
import { getAppContext } from '../utils/context';

export const getOrders: RequestHandler = async (req, res) => {
	const query = hydrateQuery(req.query);

	const orders = await prismaClient.order.findMany({
		...query,
		include: { user: true, store: true }
	});

	return res.json({ orders });
};

export const createOrder: RequestHandler = async (req, res) => {
	const { cartId, cardId, transactionFee, serviceFee } = req.body;

	// FIXME: This does not return an error when the logic function throws.
	// The fix will be part of a larger server-wide error handling refactor.
	const order = await OrderLogic.createOrder(getAppContext(req), {
		cartId,
		cardId,
		transactionFee,
		serviceFee
	});

	return res.json({ order });
};

export const getOrderById: RequestHandler<{ id: string }> = async (
	req,
	res
) => {
	const { id } = req.params;
	const ctx = getAppContext(req);

	const order = await OrderLogic.getOrderById(ctx, id);

	if (!order) {
		return res.status(404).json({ error: 'Order not found' });
	}

	return res.json({ order });
};
