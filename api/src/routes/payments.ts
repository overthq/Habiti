import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';

import type { AppEnv } from '../types/hono';
import { zodHook } from '../utils/validation';
import * as PaymentLogic from '../core/logic/payments';
import * as Schemas from '../core/validations/rest';

const payments = new Hono<AppEnv>();

payments.post(
	'/verify-transaction',
	zValidator('json', Schemas.verifyTransactionBodySchema, zodHook),
	async c => {
		const { reference } = c.req.valid('json');

		try {
			const data = await PaymentLogic.verifyTransaction(c, reference);
			return c.json({ success: true, data });
		} catch (error) {
			return c.json({ success: false, error }, 400);
		}
	}
);

payments.post(
	'/verify-transfer',
	zValidator('json', Schemas.verifyTransferBodySchema, zodHook),
	async c => {
		const { transferId } = c.req.valid('json');

		try {
			const data = await PaymentLogic.verifyTransfer(c, { transferId });
			return c.json({ success: true, data });
		} catch (error) {
			return c.json({ success: false, error }, 400);
		}
	}
);

// IMPORTANT: We have to ensure that this action stays as fast as possible.
// Any latency in our DB calls here will cause the payout to fail.
payments.post('/approve-payment', async c => {
	const body = await c.req.json();

	try {
		const payout = await PaymentLogic.approvePayment(c, body);

		if (!payout) {
			return c.json(
				{
					success: false,
					message: 'Payout not found or has already been resolved'
				},
				400
			);
		}

		return c.json({ sucess: true, message: 'Payment approved' });
	} catch (error) {
		return c.json({ success: false, error }, 400);
	}
});

export default payments;
