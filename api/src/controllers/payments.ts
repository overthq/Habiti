import { Request, Response } from 'express';

import * as CorePayments from '../core/payments';
import * as PaymentLogic from '../core/logic/payments';

import { getAppContext } from '../utils/context';

export const verifyTransaction = async (req: Request, res: Response) => {
	const { reference } = req.body;

	try {
		const data = await CorePayments.verifyTransaction(reference);

		return res.status(200).json({ success: true, data });
	} catch (error) {
		return res.status(400).json({ success: false, error });
	}
};

export const verifyTransfer = async (req: Request, res: Response) => {
	const { transferId } = req.body;

	try {
		const data = await CorePayments.verifyTransfer({ transferId });

		return res.status(200).json({ success: true, data });
	} catch (error) {
		return res.status(400).json({ success: false, error });
	}
};

// IMPORTANT: We have to ensure that this action stays as fast as possible.
// Any latency in our DB calls here will cause the payout to fail.

export const approvePayment = async (req: Request, res: Response) => {
	const ctx = getAppContext(req);

	try {
		const payout = await PaymentLogic.approvePayment(ctx, req.body);

		if (!payout) {
			return res.status(400).json({
				success: false,
				message: 'Payout not found or has already been resolved'
			});
		}

		return res.status(200).json({ sucess: true, message: 'Payment approved' });
	} catch (error) {
		return res.status(400).json({ success: false, error });
	}
};
