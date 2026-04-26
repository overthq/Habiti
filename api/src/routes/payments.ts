import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';

import type { AppEnv } from '../types/hono';
import { zodHook } from '../utils/validation';
import { rateLimit } from '../middleware/rateLimit';
import { APIException } from '../types/errors';
import * as PaymentLogic from '../core/logic/payments';
import * as Schemas from '../core/validations/rest';

const payments = new Hono<AppEnv>();

payments.use('*', rateLimit({ prefix: 'payments', windowSec: 60, limit: 30 }));

payments.post(
	'/verify-transaction',
	zValidator('json', Schemas.verifyTransactionBodySchema, zodHook),
	async c => {
		const { reference } = c.req.valid('json');

		const data = await PaymentLogic.verifyTransaction(c, reference);
		return c.json({ data });
	}
);

payments.post(
	'/verify-transfer',
	zValidator('json', Schemas.verifyTransferBodySchema, zodHook),
	async c => {
		const { transferId } = c.req.valid('json');

		const data = await PaymentLogic.verifyTransfer(c, { transferId });
		return c.json({ data });
	}
);

// IMPORTANT: This endpoint must respond quickly. Any latency in our DB calls
// here will cause the payout approval flow to fail.
payments.post(
	'/approve-payment',
	zValidator('json', Schemas.approvePaymentBodySchema, zodHook),
	async c => {
		const body = c.req.valid('json');

		const payout = await PaymentLogic.approvePayment(c, body);

		if (!payout) {
			throw new APIException(
				400,
				'Payout not found or has already been resolved'
			);
		}

		return c.json({ message: 'Payment approved' });
	}
);

export default payments;
