import { NextFunction, Request, Response } from 'express';

import { getAppContext } from '../utils/context';
import * as CardLogic from '../core/logic/cards';

export const authorizeCard = async (
	req: Request<{}, {}, { orderId: string }>,
	res: Response
) => {
	const { orderId } = req.body;

	if (!orderId) {
		return res.status(400).json({ error: 'Order ID is required' });
	}

	const ctx = getAppContext(req);

	const result = await CardLogic.authorizeCard(ctx, { orderId });

	return res.json(result);
};

export const deleteCard = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { cardId } = req.params;

	if (!cardId) {
		return res.status(400).json({ error: 'Card ID is required' });
	}

	try {
		const ctx = getAppContext(req);

		await CardLogic.deleteCard(ctx, { cardId });

		return res.status(204).json({ message: 'Card deleted successfully' });
	} catch (error) {
		next(error);
	}
};
