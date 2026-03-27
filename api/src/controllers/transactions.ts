import { Request, Response, NextFunction } from 'express';
import { TransactionStatus, TransactionType } from '../generated/prisma/client';
import { z } from 'zod';

import { getAppContext } from '../utils/context';
import * as TransactionLogic from '../core/logic/transactions';
import { LogicError, LogicErrorCode } from '../core/logic/errors';

export const getStoreTransactions = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const ctx = getAppContext(req);

		if (!ctx.storeId) {
			return res.status(400).json({ error: 'Store context required' });
		}

		const { type, status, from, to, limit, offset } = req.query;

		const transactions = await TransactionLogic.getStoreTransactions(
			ctx,
			ctx.storeId,
			{
				type: type as TransactionType | undefined,
				status: status as TransactionStatus | undefined,
				from: from as string | undefined,
				to: to as string | undefined,
				limit: limit ? parseInt(limit as string, 10) : undefined,
				offset: offset ? parseInt(offset as string, 10) : undefined
			}
		);

		return res.json({ transactions });
	} catch (error) {
		return next(error);
	}
};

export const getTransaction = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { id } = req.params;

	if (!id) {
		return res.status(400).json({ error: 'Transaction ID is required' });
	}

	try {
		const ctx = getAppContext(req);
		const transaction = await TransactionLogic.getTransactionById(ctx, id);
		return res.json({ transaction });
	} catch (error) {
		return next(error);
	}
};

export const getAdminStoreTransactions = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { id } = req.params;

	if (!id) {
		return res.status(400).json({ error: 'Store ID is required' });
	}

	try {
		const ctx = getAppContext(req);
		const { type, status, from, to, limit, offset } = req.query;

		const transactions = await TransactionLogic.getStoreTransactions(ctx, id, {
			type: type as TransactionType | undefined,
			status: status as TransactionStatus | undefined,
			from: from as string | undefined,
			to: to as string | undefined,
			limit: limit ? parseInt(limit as string, 10) : undefined,
			offset: offset ? parseInt(offset as string, 10) : undefined
		});

		return res.json({ transactions });
	} catch (error) {
		return next(error);
	}
};

const updateTransactionSchema = z.object({
	status: z.nativeEnum(TransactionStatus)
});

export const updateTransaction = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { id } = req.params;

	if (!id) {
		return res.status(400).json({ error: 'Transaction ID is required' });
	}

	const parsed = updateTransactionSchema.safeParse(req.body);
	if (!parsed.success) {
		return next(new LogicError(LogicErrorCode.ValidationFailed));
	}

	try {
		const ctx = getAppContext(req);
		const transaction = await TransactionLogic.updatePayoutTransactionStatus(
			ctx,
			{ transactionId: id, status: parsed.data.status }
		);
		return res.json({ transaction });
	} catch (error) {
		return next(error);
	}
};
