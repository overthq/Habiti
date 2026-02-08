import { orderFiltersSchema } from '../utils/queries';
import * as OrderLogic from '../core/logic/orders';
import { getAppContext } from '../utils/context';
import { Request, Response, NextFunction } from 'express';

export const getOrders = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const filters = orderFiltersSchema.parse(req.query);
		const ctx = getAppContext(req);
		const orders = await OrderLogic.getOrders(ctx, filters);
		return res.json({ orders });
	} catch (error) {
		return next(error);
	}
};

export const createOrder = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { cartId, cardId, transactionFee, serviceFee } = req.body;
		const result = await OrderLogic.createOrder(getAppContext(req), {
			cartId,
			cardId,
			transactionFee,
			serviceFee
		});

		return res.json({
			order: result.order,
			cardAuthorizationData: result.cardAuthorizationData
		});
	} catch (error) {
		return next(error);
	}
};

export const getOrderById = async (
	req: Request<{ id: string }>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const ctx = getAppContext(req);
		const order = await OrderLogic.getOrderById(ctx, id);
		return res.json({ order });
	} catch (error) {
		return next(error);
	}
};

export const updateOrder = async (
	req: Request<{ id: string }>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const { status } = req.body;
		const ctx = getAppContext(req);

		const order = await OrderLogic.updateOrderStatus(ctx, {
			orderId: id,
			status
		});

		return res.json({ order });
	} catch (error) {
		return next(error);
	}
};
