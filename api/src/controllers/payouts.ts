import { Request, Response, NextFunction } from 'express';
import { PayoutStatus } from '../generated/prisma/client';
import { z } from 'zod';

import { hydrateQuery } from '../utils/queries';
import { getAppContext } from '../utils/context';
import * as PayoutLogic from '../core/logic/payouts';
import { logicErrorToApiException, LogicErrorCode } from '../core/logic/errors';

export const getPayouts = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const query = hydrateQuery(req.query);

	const ctx = getAppContext(req);

	const payoutsResult = await PayoutLogic.getPayouts(ctx, query);

	if (!payoutsResult.ok) {
		return next(logicErrorToApiException(payoutsResult.error));
	}

	return res.json({ payouts: payoutsResult.data });
};

export const getPayout = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { id } = req.params;

	const ctx = getAppContext(req);

	if (!id) {
		return res.status(400).json({ error: 'Payout ID is required' });
	}

	const payoutResult = await PayoutLogic.getPayoutById(ctx, id);

	if (!payoutResult.ok) {
		return next(logicErrorToApiException(payoutResult.error));
	}

	return res.json({ payout: payoutResult.data });
};

const updatePayoutSchema = z.object({
	status: z.nativeEnum(PayoutStatus)
});

export const updatePayout = async (req: Request, res: Response) => {
	const { id } = req.params;

	if (!id) {
		return res.status(400).json({ error: 'Payout ID is required' });
	}

	const parsed = updatePayoutSchema.safeParse(req.body);
	if (!parsed.success) {
		return res
			.status(400)
			.json(logicErrorToApiException(LogicErrorCode.ValidationFailed));
	}

	const { status } = parsed.data;
	const ctx = getAppContext(req);

	const updatedPayoutResult = await PayoutLogic.updatePayout(ctx, {
		payoutId: id,
		status
	});

	if (!updatedPayoutResult.ok) {
		return res
			.status(logicErrorToApiException(updatedPayoutResult.error).statusCode)
			.json(logicErrorToApiException(updatedPayoutResult.error));
	}

	return res.json({ updatedPayout: updatedPayoutResult.data });
};
