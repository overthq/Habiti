import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { HTTPException } from 'hono/http-exception';

import * as PaymentLogic from '../core/logic/payments';
import * as Schemas from '../core/validations/rest';
import { zodHook } from '../utils/validation';
import { rateLimit } from '../middleware/rateLimit';
import type { AppEnv } from '../types/hono';

const payments = new Hono<AppEnv>();

payments.use('*', rateLimit({ prefix: 'payments', windowSec: 60, limit: 30 }));

payments.post(
	'/verify-transaction',
	zValidator('json', Schemas.verifyTransactionBodySchema, zodHook),
	async c => {
		const { reference } = c.req.valid('json');

		// Paystack enforces that we return a 200 for successful verifications
		// and a 400 for all failures.
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

// IMPORTANT: This endpoint must respond quickly. Any latency in our DB calls
// here will cause the payout approval flow to fail.
payments.post(
	'/approve-payment',
	zValidator('json', Schemas.approvePaymentBodySchema, zodHook),
	async c => {
		const body = c.req.valid('json');

		// Paystack enforces that we return a 200 for successful verifications
		// and a 400 for all failures.
		try {
			const payout = await PaymentLogic.approvePayment(c, body);

			if (!payout) {
				throw new HTTPException(400, {
					message: 'Payout not found or has already been resolved'
				});
			}

			return c.json({ message: 'Payment approved' });
		} catch (error) {
			return c.json({ success: false, error }, 400);
		}
	}
);

export default payments;
