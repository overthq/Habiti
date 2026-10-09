import { mock } from 'bun:test';

// An in-memory stand-in for the tables the ledger writes, so tests run the
// real `moveMoney` rather than a mock of it. It implements only the operations
// the ledger path performs.

export interface FakeStoreRow {
	id: string;
	name: string;
	realizedRevenue: bigint;
	unrealizedRevenue: bigint;
	paidOut: bigint;
	pendingPayouts: bigint;
}

/**
 * Seed for the store's payout destination. Omitted by tests that never reach
 * the payout path, which then behave like a store with no account attached.
 */
export interface FakePayoutAccountRow {
	id?: string;
	storeId: string;
	accountNumber?: string;
	bankCode?: string;
	recipientRef?: string;
	isDefault?: boolean;
	status?: 'Active' | 'Inactive';
}

interface Row {
	[key: string]: any;
}

const matches = (row: Row, where: Row): boolean =>
	Object.entries(where).every(([key, value]) => {
		if (value === undefined) return true;
		return row[key] === value;
	});

export const createFakeLedgerDb = (
	store: FakeStoreRow,
	payoutAccount?: FakePayoutAccountRow
) => {
	const stores = new Map<string, FakeStoreRow>([[store.id, { ...store }]]);
	const payoutAccounts: Row[] = payoutAccount
		? [
				{
					id: 'payout-account-1',
					provider: 'paystack',
					accountNumber: '0123456789',
					bankCode: '058',
					accountName: 'Ada Stores',
					bankName: 'Guaranty Trust Bank',
					recipientRef: 'RCP_test',
					label: null,
					isDefault: true,
					status: 'Active',
					verifiedAt: new Date(),
					createdAt: new Date(),
					deactivatedAt: null,
					...payoutAccount
				}
			]
		: [];
	const accounts: Row[] = [];
	const ledgerTransactions: Row[] = [];
	const entries: Row[] = [];
	const transactions: Row[] = [];
	const payouts: Row[] = [];

	let ids = 0;
	const nextId = (prefix: string) => `${prefix}-${++ids}`;

	const balanceOf = (kind: string, reason?: string) =>
		entries
			.filter(entry => {
				const account = accounts.find(a => a.id === entry.accountId)!;
				const ledgerTransaction = ledgerTransactions.find(
					t => t.id === entry.transactionId
				)!;

				return (
					account.storeId === store.id &&
					account.kind === kind &&
					(!reason || ledgerTransaction.reason === reason)
				);
			})
			.reduce(
				(sum, entry) =>
					entry.direction === 'Credit'
						? sum + entry.amount
						: sum - entry.amount,
				0n
			);

	// The store's columns are recalculated from the ledger on every write, so
	// the balances a test asks for have to exist as entries.
	const seed = (kind: string, amount: bigint, reason = 'OpeningBalance') => {
		if (amount === 0n) return;

		let account = accounts.find(a => a.kind === kind);

		if (!account) {
			account = { id: nextId('acct'), kind, storeId: store.id, userId: null };
			accounts.push(account);
		}

		const ledgerTransaction = { id: nextId('ltx'), reason };
		ledgerTransactions.push(ledgerTransaction);

		entries.push({
			id: nextId('entry'),
			transactionId: ledgerTransaction.id,
			accountId: account.id,
			direction: amount > 0n ? 'Credit' : 'Debit',
			amount: amount > 0n ? amount : -amount
		});
	};

	seed('Unrealized', store.unrealizedRevenue);
	seed(
		'Available',
		store.realizedRevenue - store.paidOut - store.pendingPayouts
	);
	seed('PendingPayouts', store.pendingPayouts + store.paidOut);
	seed('PendingPayouts', -store.paidOut, 'PayoutSettled');

	const client = {
		store: {
			findUnique: mock(async ({ where, include }: any) => {
				const found = stores.get(where.id);
				if (!found) return null;
				return include?.managers
					? { ...found, managers: [{ managerId: 'user-1', storeId: found.id }] }
					: { ...found };
			})
		},

		storeManager: {
			findUnique: mock(async () => ({
				managerId: 'user-1',
				storeId: store.id
			}))
		},

		ledgerAccount: {
			findFirst: mock(
				async ({ where }: any) => accounts.find(a => matches(a, where)) ?? null
			),
			create: mock(async ({ data }: any) => {
				const row = { id: nextId('acct'), createdAt: new Date(), ...data };
				accounts.push(row);
				return { ...row };
			})
		},

		ledgerTransaction: {
			create: mock(async ({ data: { entries: nested, ...data } }: any) => {
				const row = { id: nextId('ltx'), createdAt: new Date(), ...data };
				ledgerTransactions.push(row);

				for (const entry of nested.create) {
					entries.push({
						id: nextId('entry'),
						transactionId: row.id,
						...entry
					});
				}

				return { ...row };
			}),
			findUnique: mock(
				async ({ where }: any) =>
					ledgerTransactions.find(t => matches(t, where)) ?? null
			)
		},

		ledgerEntry: {
			groupBy: mock(async ({ where }: any) =>
				['Debit', 'Credit'].map(direction => ({
					direction,
					_sum: {
						amount: entries
							.filter(
								e =>
									e.accountId === where.accountId && e.direction === direction
							)
							.reduce((sum, e) => sum + e.amount, 0n)
					}
				}))
			)
		},

		transaction: {
			create: mock(async ({ data }: any) => {
				const row = {
					id: nextId('txn'),
					createdAt: new Date(),
					updatedAt: new Date(),
					...data
				};
				transactions.push(row);
				return { ...row };
			}),
			findUnique: mock(
				async ({ where }: any) =>
					transactions.find(t => matches(t, where)) ?? null
			),
			findFirst: mock(
				async ({ where }: any) =>
					transactions.find(t => matches(t, where)) ?? null
			),
			updateMany: mock(async ({ where, data }: any) => {
				const hits = transactions.filter(t => matches(t, where));
				hits.forEach(row => Object.assign(row, data));
				return { count: hits.length };
			})
		},

		payout: {
			create: mock(async ({ data }: any) => {
				const row = {
					createdAt: new Date(),
					updatedAt: new Date(),
					failureReason: null,
					...data
				};
				payouts.push(row);
				return { ...row };
			}),
			findUnique: mock(async ({ where }: any) => {
				const found = payouts.find(p => matches(p, where));
				return found ? { ...found } : null;
			}),
			findUniqueOrThrow: mock(async ({ where }: any) => {
				const found = payouts.find(p => matches(p, where));
				if (!found) throw new Error(`no payout ${JSON.stringify(where)}`);
				return { ...found };
			}),
			update: mock(async ({ where, data }: any) => {
				const found = payouts.find(p => matches(p, where));
				if (!found) throw new Error(`no payout ${JSON.stringify(where)}`);
				Object.assign(found, data);
				return { ...found };
			})
		},

		storePayoutAccount: {
			findFirst: mock(
				async ({ where }: any) =>
					payoutAccounts.find(a => matches(a, where)) ?? null
			),
			findUnique: mock(
				async ({ where }: any) =>
					payoutAccounts.find(a => matches(a, where)) ?? null
			),
			count: mock(
				async ({ where }: any) =>
					payoutAccounts.filter(a => matches(a, where)).length
			),
			create: mock(async ({ data }: any) => {
				const row = {
					id: nextId('payout-account'),
					createdAt: new Date(),
					deactivatedAt: null,
					...data
				};
				payoutAccounts.push(row);
				return { ...row };
			}),
			update: mock(async ({ where, data }: any) => {
				const found = payoutAccounts.find(a => matches(a, where));
				if (!found) throw new Error(`no payout account ${where.id}`);
				Object.assign(found, data);
				return { ...found };
			}),
			updateMany: mock(async ({ where, data }: any) => {
				const hits = payoutAccounts.filter(a => matches(a, where));
				hits.forEach(row => Object.assign(row, data));
				return { count: hits.length };
			})
		},

		// Stands in for `lockStoreBalance`'s `SELECT ... FOR UPDATE`.
		$queryRaw: mock(async (..._args: unknown[]) => {
			const found = stores.get(store.id)!;
			return [
				{
					realizedRevenue: found.realizedRevenue,
					paidOut: found.paidOut,
					pendingPayouts: found.pendingPayouts
				}
			];
		}),

		// Stands in for `recalculateStoreBalance`.
		$executeRaw: mock(async (..._args: unknown[]) => {
			const pendingPayouts = balanceOf('PendingPayouts');
			const paidOut = -balanceOf('PendingPayouts', 'PayoutSettled');

			Object.assign(stores.get(store.id)!, {
				unrealizedRevenue: balanceOf('Unrealized'),
				pendingPayouts,
				paidOut,
				realizedRevenue: balanceOf('Available') + pendingPayouts + paidOut
			});

			return 1;
		}),

		$transaction: mock(async (fn: any) => fn(client))
	};

	return {
		client,
		tables: {
			stores,
			accounts,
			ledgerTransactions,
			entries,
			transactions,
			payouts,
			payoutAccounts
		}
	};
};
