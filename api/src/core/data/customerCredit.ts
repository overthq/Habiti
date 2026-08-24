import {
	AccountKind,
	EntryDirection,
	LedgerReason
} from '../../generated/prisma/client';
import type { TransactionClient } from '../../generated/prisma/internal/prismaNamespace';
import {
	getAccountBalance,
	getCustomerCreditBalance,
	getOrCreateAccount,
	postJournal
} from './ledger';

/**
 * Customer refund balances.
 *
 * A cancelled order moves money out of the store's bucket and into the
 * customer's credit account, where it sits until an admin cashes it out.
 *
 * The awkward part of giving customers accounts is deletion: an account that
 * carries history must never disappear, but users can still ask to be
 * deleted. The two are reconciled by *detaching* -- the account and its
 * entries survive with `formerUserId` recording who they belonged to.
 */

export class OutstandingCreditError extends Error {
	constructor(
		public readonly userId: string,
		public readonly balance: bigint
	) {
		super(
			`User ${userId} still has an outstanding credit balance of ${balance}`
		);
		this.name = 'OutstandingCreditError';
	}
}

export const getCreditBalance = getCustomerCreditBalance;

interface WithdrawParams {
	userId: string;
	amount: bigint;
	/** Distinguishes repeat withdrawals by the same customer. */
	reference: string;
}

/**
 * Pays a customer's credit balance out to them.
 *
 * Admin-triggered: there is no self-serve withdrawal, so the amount is checked
 * against the balance here rather than trusted from the caller.
 */
export const withdrawCustomerCredit = async (
	tx: TransactionClient,
	params: WithdrawParams
) => {
	if (params.amount <= 0n) {
		throw new Error('Withdrawal amount must be positive');
	}

	const account = await getOrCreateAccount(tx, {
		kind: AccountKind.CustomerCredit,
		userId: params.userId
	});

	const balance = await getAccountBalance(tx, account.id);

	if (params.amount > balance) {
		throw new Error(
			`Withdrawal of ${params.amount} exceeds credit balance of ${balance}`
		);
	}

	const cash = await getOrCreateAccount(tx, { kind: AccountKind.PlatformCash });

	return postJournal(tx, {
		reason: LedgerReason.CustomerCreditWithdrawn,
		idempotencyKey: `credit:${params.userId}:withdrawn:${params.reference}`,
		description: 'Refund paid out to customer',
		entries: [
			{
				account,
				direction: EntryDirection.Debit,
				amount: params.amount
			},
			{ account: cash, direction: EntryDirection.Credit, amount: params.amount }
		]
	});
};

/**
 * Moves a customer's credit to another user and detaches the source account.
 *
 * Used when merging an anonymous user into a real one. The balance moves via a
 * journal rather than by repointing the account's `userId`, because
 * re-owning an account silently rewrites the history of every entry in it.
 */
export const transferCustomerCredit = async (
	tx: TransactionClient,
	fromUserId: string,
	toUserId: string
) => {
	const source = await tx.ledgerAccount.findFirst({
		where: {
			kind: AccountKind.CustomerCredit,
			userId: fromUserId
		}
	});

	if (!source) return null;

	const balance = await getAccountBalance(tx, source.id);

	if (balance > 0n) {
		const destination = await getOrCreateAccount(tx, {
			kind: AccountKind.CustomerCredit,
			userId: toUserId
		});

		await postJournal(tx, {
			reason: LedgerReason.ManualAdjustment,
			idempotencyKey: `credit:merge:${fromUserId}:${toUserId}`,
			description: 'Credit moved on account merge',
			entries: [
				{ account: source, direction: EntryDirection.Debit, amount: balance },
				{
					account: destination,
					direction: EntryDirection.Credit,
					amount: balance
				}
			]
		});
	}

	await detachCustomerAccounts(tx, fromUserId);

	return balance;
};

/**
 * Severs a user's ledger accounts from their user row so the row can be
 * deleted, keeping the journals intact.
 *
 * Refuses while money is still owed -- deleting a user we owe money to would
 * quietly write off a liability.
 */
export const detachCustomerAccounts = async (
	tx: TransactionClient,
	userId: string
) => {
	const accounts = await tx.ledgerAccount.findMany({ where: { userId } });

	if (accounts.length === 0) return 0;

	for (const account of accounts) {
		const balance = await getAccountBalance(tx, account.id);

		if (balance !== 0n) {
			throw new OutstandingCreditError(userId, balance);
		}
	}

	const { count } = await tx.ledgerAccount.updateMany({
		where: { userId },
		data: { userId: null, formerUserId: userId, detachedAt: new Date() }
	});

	return count;
};
