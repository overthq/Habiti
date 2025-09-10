import { RequestHandler } from 'express';

import prismaClient from '../config/prisma';
import { hydrateQuery } from '../utils/queries';
import * as OrderLogic from '../core/logic/orders';
import * as OrderData from '../core/data/orders';
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

	if (!req.auth) {
		return res.status(401).json({ error: 'User not authenticated' });
	}

	const order = await OrderLogic.createOrder(
		{ cartId, cardId, transactionFee, serviceFee },
		getAppContext(req)
	);

	return res.json({ order });
};

export const getOrderById: RequestHandler = async (req, res) => {
	const { id } = req.params;

	if (!id) {
		return res.status(400).json({ error: 'Order ID is required' });
	}

	const order = OrderData.getOrderById(prismaClient, id);

	if (!order) {
		return res.status(404).json({ error: 'Order not found' });
	}

	return res.json({ order });
};
