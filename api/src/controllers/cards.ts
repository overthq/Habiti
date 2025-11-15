import { Request, Response } from 'express';

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
