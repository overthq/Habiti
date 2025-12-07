import { Request, Response } from 'express';
import { PayoutStatus } from '../generated/prisma/client';
import { z } from 'zod';

import { hydrateQuery } from '../utils/queries';
import { getAppContext } from '../utils/context';
import * as PayoutLogic from '../core/logic/payouts';

export const getPayouts = async (req: Request, res: Response) => {
	const query = hydrateQuery(req.query);

	const ctx = getAppContext(req);

	const payouts = await PayoutLogic.getPayouts(ctx, query);

	return res.json({ payouts });
};

export const getPayout = async (req: Request, res: Response) => {
	const { id } = req.params;

	const ctx = getAppContext(req);

	if (!id) {
		return res.status(400).json({ error: 'Payout ID is required' });
	}

	const payout = await PayoutLogic.getPayoutById(ctx, id);

	if (!payout) {
		return res.status(404).json({ error: 'Payout not found' });
	}

	return res.json({ payout });
};

const updatePayoutSchema = z.object({
	status: z.nativeEnum(PayoutStatus)
});

export const updatePayout = async (req: Request, res: Response) => {
	const { id } = req.params;

	if (!id) {
		return res.status(400).json({ error: 'Payout ID is required' });
	}

	try {
		const { status } = updatePayoutSchema.parse(req.body);

		const ctx = getAppContext(req);

		const updatedPayout = await PayoutLogic.updatePayout(ctx, {
			payoutId: id,
			status
		});

		return res.json({ updatedPayout });
	} catch (error) {
		return res.status(500).json({ error: (error as Error)?.message });
	}
};
