import { randomBytes } from 'crypto';

import type { Context } from 'hono';

import {
	BankTransferStatus,
	OrderStatus,
	PrismaClient
} from '../../generated/prisma/client';
import type { AppEnv } from '../../types/hono';
import * as CorePayments from '../payments';
import type { BankTransferChargeResponse } from '../payments/paystack';
import { LogicError, LogicErrorCode } from './errors';

// Inside Paystack's 15 minute–8 hour window for `account_expires_at`.
const ACCOUNT_TTL_MS = 30 * 60 * 1000;

const OPEN_STATUSES: BankTransferStatus[] = [
	BankTransferStatus.Pending,
	BankTransferStatus.Expired,
	BankTransferStatus.Rejected,
	BankTransferStatus.Failed
];

export interface BankTransferDetails {
	id: string;
	orderId: string;
	reference: string;
	amount: number;
	currency: string;
	accountName: string;
	accountNumber: string;
	bankName: string;
	expiresAt: string;
	status: BankTransferStatus;
}

export type BankTransferDecision =
	| { kind: 'unrelated' }
	| { kind: 'unverified'; reference: string }
	| { kind: 'pay'; orderId: string }
	| {
			kind: 'reject';
			orderId: string;
			reference: string;
			reason: 'amount' | 'currency' | 'order' | 'untracked';
	  };

interface ChargeFacts {
	reference: string | undefined;
	amount: number | undefined;
	currency: string | undefined;
	metadata: unknown;
}

const factsFromCharge = (data: object): ChargeFacts => {
	const record = data as Record<string, unknown>;

	return {
		reference:
			typeof record.reference === 'string' ? record.reference : undefined,
		amount: typeof record.amount === 'number' ? record.amount : undefined,
		currency: typeof record.currency === 'string' ? record.currency : undefined,
		metadata: 'metadata' in record ? record.metadata : undefined
	};
};

const orderIdFromMetadata = (metadata: unknown) => {
	if (!metadata || typeof metadata !== 'object') return undefined;

	const orderId = (metadata as { orderId?: unknown }).orderId;

	return typeof orderId === 'string' ? orderId : undefined;
};

const isTaggedBankTransfer = (metadata: unknown) =>
	!!metadata &&
	typeof metadata === 'object' &&
	(metadata as { bankTransfer?: unknown }).bankTransfer === true;

const isUniqueViolation = (error: unknown) =>
	(error as { code?: string } | null)?.code === 'P2002';

const present = (row: {
	id: string;
	orderId: string;
	reference: string;
	amount: number;
	currency: string;
	accountName: string;
	accountNumber: string;
	bankName: string;
	expiresAt: Date;
	status: BankTransferStatus;
}): BankTransferDetails => ({
	id: row.id,
	orderId: row.orderId,
	reference: row.reference,
	amount: row.amount,
	currency: row.currency,
	accountName: row.accountName,
	accountNumber: row.accountNumber,
	bankName: row.bankName,
	expiresAt: row.expiresAt.toISOString(),
	status: row.status
});

const findLatest = (prisma: PrismaClient, orderId: string) =>
	prisma.bankTransferPayment.findFirst({
		where: { orderId },
		orderBy: { createdAt: 'desc' }
	});

const markStatus = async (
	prisma: PrismaClient,
	id: string,
	from: BankTransferStatus[],
	status: BankTransferStatus
) => {
	await prisma.bankTransferPayment.updateMany({
		where: { id, status: { in: from } },
		data: { status }
	});

	return prisma.bankTransferPayment.findUnique({ where: { id } });
};

// Paystack invalidates the account at expiry and sends `bank.transfer.rejected`
// when the amount is wrong. `charge.success` for our reference means they
// accepted the money — including a transfer that lands after our local expiry —
// so a matching amount still pays the order. A mismatch never does.
export const assessBankTransferCharge = async (
	prisma: PrismaClient,
	data: unknown
): Promise<BankTransferDecision> => {
	const facts =
		data && typeof data === 'object'
			? factsFromCharge(data)
			: {
					reference: undefined,
					amount: undefined,
					currency: undefined,
					metadata: undefined
				};

	if (!facts.reference) {
		if (!isTaggedBankTransfer(facts.metadata)) return { kind: 'unrelated' };

		return {
			kind: 'reject',
			orderId: orderIdFromMetadata(facts.metadata) ?? '',
			reference: '',
			reason: 'untracked'
		};
	}

	const row = await prisma.bankTransferPayment.findUnique({
		where: { reference: facts.reference }
	});

	if (!row) {
		if (!isTaggedBankTransfer(facts.metadata)) return { kind: 'unrelated' };

		return {
			kind: 'reject',
			orderId: orderIdFromMetadata(facts.metadata) ?? '',
			reference: facts.reference,
			reason: 'untracked'
		};
	}

	if (row.status === BankTransferStatus.Succeeded) {
		return { kind: 'pay', orderId: row.orderId };
	}

	if (typeof facts.amount !== 'number') {
		return { kind: 'unverified', reference: facts.reference };
	}

	const metadataOrderId = orderIdFromMetadata(facts.metadata);
	let reason: 'amount' | 'currency' | 'order' | null = null;

	if (facts.currency && facts.currency !== row.currency) reason = 'currency';
	else if (metadataOrderId && metadataOrderId !== row.orderId) reason = 'order';
	else if (facts.amount !== row.amount) reason = 'amount';

	if (reason) {
		await markStatus(
			prisma,
			row.id,
			OPEN_STATUSES,
			BankTransferStatus.Rejected
		);

		return {
			kind: 'reject',
			orderId: row.orderId,
			reference: row.reference,
			reason
		};
	}

	await markStatus(prisma, row.id, OPEN_STATUSES, BankTransferStatus.Succeeded);

	return { kind: 'pay', orderId: row.orderId };
};

export const rejectBankTransferCharge = async (
	prisma: PrismaClient,
	reference: string | undefined
) => {
	if (!reference) return 'untracked' as const;

	const row = await prisma.bankTransferPayment.findUnique({
		where: { reference }
	});

	if (!row) return 'untracked' as const;

	if (row.status === BankTransferStatus.Succeeded) return 'ignored' as const;

	await markStatus(prisma, row.id, OPEN_STATUSES, BankTransferStatus.Rejected);

	return 'rejected' as const;
};

const payOrder = async (
	c: Context<AppEnv>,
	orderId: string,
	webhookEventId?: string | null
) => {
	const { transitionOrderToPending } = await import('./payments');

	await transitionOrderToPending(c, orderId, webhookEventId);
};

const requireOwnedOrder = async (c: Context<AppEnv>, orderId: string) => {
	const userId = c.var.auth?.id;
	const email = c.var.auth?.email;

	if (!userId) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	if (!email) {
		throw new LogicError(
			LogicErrorCode.Forbidden,
			'A full account is required to make payments'
		);
	}

	const order = await c.var.prisma.order.findUnique({ where: { id: orderId } });

	if (!order) {
		throw new LogicError(LogicErrorCode.OrderNotFound);
	}

	if (order.userId !== userId) {
		throw new LogicError(LogicErrorCode.Forbidden);
	}

	return { order, email, userId };
};

interface TransferInstructions {
	reference: string;
	accountName: string;
	accountNumber: string;
	bankName: string;
	bankSlug: string | null;
	expiresAt: Date;
}

const readInstructions = (
	response: BankTransferChargeResponse,
	expectedAmount: number
): TransferInstructions | null => {
	const data = response?.data;

	if (!response?.status || !data) return null;
	if (data.status !== 'pending_bank_transfer') return null;
	if (typeof data.amount === 'number' && data.amount !== expectedAmount) {
		return null;
	}

	const accountNumber =
		typeof data.account_number === 'string'
			? data.account_number.replace(/\s/g, '')
			: '';
	const accountName =
		typeof data.account_name === 'string' ? data.account_name.trim() : '';
	const bankName =
		typeof data.bank?.name === 'string' ? data.bank.name.trim() : '';
	const reference =
		typeof data.reference === 'string' ? data.reference.trim() : '';
	const expiresAt =
		typeof data.account_expires_at === 'string'
			? new Date(data.account_expires_at)
			: new Date(NaN);

	if (!/^\d{6,20}$/.test(accountNumber)) return null;
	if (!accountName || !bankName || !reference) return null;
	if (Number.isNaN(expiresAt.getTime()) || expiresAt.getTime() <= Date.now()) {
		return null;
	}

	return {
		reference,
		accountName,
		accountNumber,
		bankName,
		bankSlug: typeof data.bank?.slug === 'string' ? data.bank.slug : null,
		expiresAt
	};
};

export const initiateBankTransfer = async (
	c: Context<AppEnv>,
	orderId: string
) =>
	c.var.tracer.startSpan('bankTransfer.initiate', async () => {
		const { order, email, userId } = await requireOwnedOrder(c, orderId);
		const latest = await findLatest(c.var.prisma, order.id);

		if (order.status !== OrderStatus.PaymentPending) {
			if (latest?.status === BankTransferStatus.Succeeded) {
				await payOrder(c, order.id);
				return present(latest);
			}

			throw new LogicError(LogicErrorCode.OrderNotPayable);
		}

		if (latest?.status === BankTransferStatus.Succeeded) {
			await payOrder(c, order.id);
			return present(latest);
		}

		if (
			latest?.status === BankTransferStatus.Pending &&
			latest.expiresAt.getTime() > Date.now()
		) {
			return present(latest);
		}

		if (latest?.status === BankTransferStatus.Pending) {
			await markStatus(
				c.var.prisma,
				latest.id,
				[BankTransferStatus.Pending],
				BankTransferStatus.Expired
			);
		}

		const amount = order.total + order.transactionFee + order.serviceFee;

		if (amount <= 0) {
			throw new LogicError(LogicErrorCode.PaymentFailed);
		}

		const reference = `bt.${randomBytes(16).toString('hex')}`;
		const accountExpiresAt = new Date(
			Date.now() + ACCOUNT_TTL_MS
		).toISOString();
		const response = await CorePayments.createBankTransferCharge({
			email,
			amount: String(amount),
			reference,
			accountExpiresAt,
			metadata: { orderId: order.id, bankTransfer: true }
		});
		const instructions = readInstructions(response, amount);

		if (!instructions) {
			c.var.logger.error(
				{
					orderId: order.id,
					paystackStatus: response?.data?.status,
					paystackMessage: response?.message
				},
				'bank_transfer.invalid_response'
			);

			throw new LogicError(LogicErrorCode.PaymentFailed);
		}

		try {
			const row = await c.var.prisma.bankTransferPayment.create({
				data: {
					orderId: order.id,
					reference: instructions.reference,
					amount,
					currency: 'NGN',
					accountName: instructions.accountName,
					accountNumber: instructions.accountNumber,
					bankName: instructions.bankName,
					bankSlug: instructions.bankSlug,
					expiresAt: instructions.expiresAt,
					status: BankTransferStatus.Pending
				}
			});

			c.var.services.analytics.track({
				event: 'bank_transfer_started',
				distinctId: userId,
				properties: {
					orderId: order.id,
					amount,
					reference: instructions.reference
				},
				groups: { store: order.storeId }
			});

			return present(row);
		} catch (error) {
			if (!isUniqueViolation(error)) throw error;

			const pending = await c.var.prisma.bankTransferPayment.findFirst({
				where: { orderId: order.id, status: BankTransferStatus.Pending }
			});

			if (pending && pending.expiresAt.getTime() > Date.now()) {
				return present(pending);
			}

			throw error;
		}
	});

const applyVerifiedCharge = async (
	c: Context<AppEnv>,
	row: { id: string; reference: string },
	verified: {
		status: boolean;
		data: { status: string; reference: string };
	}
) => {
	if (verified.status !== true) return null;

	if (verified.data.status === 'success') {
		if (verified.data.reference !== row.reference) {
			c.var.logger.error(
				{ reference: row.reference, got: verified.data.reference },
				'bank_transfer.reference_mismatch'
			);

			return null;
		}

		const decision = await assessBankTransferCharge(
			c.var.prisma,
			verified.data
		);

		if (decision.kind !== 'pay' && decision.kind !== 'reject') return null;

		const fresh = await c.var.prisma.bankTransferPayment.findUnique({
			where: { id: row.id }
		});

		if (!fresh) {
			throw new LogicError(LogicErrorCode.Unexpected);
		}

		if (decision.kind === 'pay') {
			await payOrder(c, decision.orderId);
		}

		return present(fresh);
	}

	if (
		verified.data.status === 'failed' ||
		verified.data.status === 'reversed'
	) {
		const fresh = await markStatus(
			c.var.prisma,
			row.id,
			[BankTransferStatus.Pending, BankTransferStatus.Expired],
			BankTransferStatus.Failed
		);

		if (!fresh) {
			throw new LogicError(LogicErrorCode.Unexpected);
		}

		return present(fresh);
	}

	return null;
};

export const syncBankTransfer = async (c: Context<AppEnv>, orderId: string) =>
	c.var.tracer.startSpan('bankTransfer.sync', async () => {
		const { order } = await requireOwnedOrder(c, orderId);
		const row = await findLatest(c.var.prisma, order.id);

		if (!row) {
			throw new LogicError(LogicErrorCode.BankTransferNotFound);
		}

		if (row.status === BankTransferStatus.Succeeded) {
			await payOrder(c, row.orderId);
			return present(row);
		}

		if (row.status !== BankTransferStatus.Pending) {
			return present(row);
		}

		let verified: Awaited<
			ReturnType<typeof CorePayments.verifyTransaction>
		> | null = null;

		try {
			verified = await CorePayments.verifyTransaction(row.reference);
		} catch (error) {
			c.var.logger.warn(
				{ err: error, reference: row.reference },
				'bank_transfer.verify_failed'
			);
		}

		if (verified) {
			const applied = await applyVerifiedCharge(c, row, verified);

			if (applied) return applied;
		}

		if (row.expiresAt.getTime() <= Date.now()) {
			const fresh = await markStatus(
				c.var.prisma,
				row.id,
				[BankTransferStatus.Pending],
				BankTransferStatus.Expired
			);

			return present(fresh ?? row);
		}

		const fresh = await c.var.prisma.bankTransferPayment.findUnique({
			where: { id: row.id }
		});

		return present(fresh ?? row);
	});
