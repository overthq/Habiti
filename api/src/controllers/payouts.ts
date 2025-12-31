import { Request, Response, NextFunction } from 'express';
import { PayoutStatus } from '../generated/prisma/client';
import { z } from 'zod';

import { hydrateQuery } from '../utils/queries';
import { getAppContext } from '../utils/context';
import * as PayoutLogic from '../core/logic/payouts';
import { LogicError, LogicErrorCode } from '../core/logic/errors';

export const getPayouts = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const query = hydrateQuery(req.query);
		const ctx = getAppContext(req);
		const payouts = await PayoutLogic.getPayouts(ctx, query);
		return res.json({ payouts });
	} catch (error) {
		return next(error);
	}
};

export const getPayout = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { id } = req.params;

	if (!id) {
		return res.status(400).json({ error: 'Payout ID is required' });
	}

	try {
		const ctx = getAppContext(req);
		const payout = await PayoutLogic.getPayoutById(ctx, id);
		return res.json({ payout });
	} catch (error) {
		return next(error);
	}
};

const updatePayoutSchema = z.object({
	status: z.nativeEnum(PayoutStatus)
});

export const updatePayout = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { id } = req.params;

	if (!id) {
		return res.status(400).json({ error: 'Payout ID is required' });
	}

	const parsed = updatePayoutSchema.safeParse(req.body);
	if (!parsed.success) {
		return next(new LogicError(LogicErrorCode.ValidationFailed));
	}

	try {
		const { status } = parsed.data;
		const ctx = getAppContext(req);

		const updatedPayout = await PayoutLogic.updatePayout(ctx, {
			payoutId: id,
			status
		});

		return res.json({ updatedPayout });
	} catch (error) {
		return next(error);
	}
};
