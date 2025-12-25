import { hydrateQuery } from '../utils/queries';
import * as OrderLogic from '../core/logic/orders';
import { getAppContext } from '../utils/context';
import { logicErrorToApiException } from '../core/logic/errors';
import { Request, Response, NextFunction } from 'express';

export const getOrders = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const query = hydrateQuery(req.query);

	const ctx = getAppContext(req);

	const ordersResult = await OrderLogic.getOrders(ctx, query);

	if (!ordersResult.ok) {
		return next(logicErrorToApiException(ordersResult.error));
	}

	return res.json({ orders: ordersResult.data });
};

export const createOrder = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { cartId, cardId, transactionFee, serviceFee } = req.body;

	const result = await OrderLogic.createOrder(getAppContext(req), {
		cartId,
		cardId,
		transactionFee,
		serviceFee
	});

	if (!result.ok) {
		return next(logicErrorToApiException(result.error));
	}

	return res.json({
		order: result.data.order,
		cardAuthorizationData: result.data.cardAuthorizationData
	});
};

export const getOrderById = async (
	req: Request<{ id: string }>,
	res: Response,
	next: NextFunction
) => {
	const { id } = req.params;
	const ctx = getAppContext(req);

	const orderResult = await OrderLogic.getOrderById(ctx, id);

	if (!orderResult.ok) {
		return next(logicErrorToApiException(orderResult.error));
	}

	return res.json({ order: orderResult.data });
};
