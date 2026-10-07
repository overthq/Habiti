import { mock } from 'bun:test';

/**
 * A small in-memory stand-in for the tables the ledger writes.
 *
 * The point is that tests exercise the *real* posting code -- `postJournal`,
 * `getOrCreateAccount`, the projection fold -- rather than a mock of it. Only
 * the storage is fake, so a mistake in the accounting still fails the test.
 *
 * It is deliberately not a general Prisma emulator: it implements exactly the
 * operations the ledger path performs.
 */

export interface FakeStoreRow {
	id: string;
	name: string;
	realizedRevenue: bigint;
	unrealizedRevenue: bigint;
	paidOut: bigint;
	pendingPayouts: bigint;
	ledgerSequence: bigint;
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
	const journals: Row[] = [];
	const entries: Row[] = [];
	const statement: Row[] = [];
	const payouts: Row[] = [];

	let sequence = 0n;
	let ids = 0;
	const nextId = (prefix: string) => `${prefix}-${++ids}`;

	const client = {
		store: {
			findUnique: mock(async ({ where, include }: any) => {
				const found = stores.get(where.id);
				if (!found) return null;
				return include?.managers
					? { ...found, managers: [{ managerId: 'user-1', storeId: found.id }] }
					: { ...found };
			}),
			update: mock(async ({ where, data }: any) => {
				const found = stores.get(where.id);
				if (!found) throw new Error(`no store ${where.id}`);
				Object.assign(found, data);
				return { ...found };
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
			create: mock(async ({ data }: any) => {
				if (journals.some(j => j.idempotencyKey === data.idempotencyKey)) {
					throw Object.assign(new Error('unique violation'), {
						code: 'P2002'
					});
				}
				sequence += 1n;
				const row = {
					id: nextId('jrnl'),
					sequence,
					createdAt: new Date(),
					description: null,
					orderId: null,
					payoutRequestId: null,
					webhookEventId: null,
					...data
				};
				journals.push(row);
				return { ...row };
			}),
			findUnique: mock(
				async ({ where }: any) => journals.find(j => matches(j, where)) ?? null
			),
			findFirst: mock(
				async ({ where }: any) => journals.find(j => matches(j, where)) ?? null
			)
		},

		ledgerEntry: {
			createMany: mock(async ({ data }: any) => {
				for (const entry of data) {
					entries.push({ id: nextId('entry'), ...entry });
				}
				return { count: data.length };
			})
		},

		storeStatementEntry: {
			create: mock(async ({ data }: any) => {
				const row = { id: nextId('stmt'), updatedAt: new Date(), ...data };
				statement.push(row);
				return { ...row };
			}),
			findUnique: mock(
				async ({ where }: any) => statement.find(s => matches(s, where)) ?? null
			),
			updateMany: mock(async ({ where, data }: any) => {
				const hits = statement.filter(s => matches(s, where));
				hits.forEach(row => Object.assign(row, data));
				return { count: hits.length };
			})
		},

		payoutRequest: {
			create: mock(async ({ data }: any) => {
				const row = {
					id: nextId('payout'),
					createdAt: new Date(),
					updatedAt: new Date(),
					providerRef: null,
					failureReason: null,
					...data
				};
				payouts.push(row);
				return { ...row };
			}),
			findUnique: mock(
				async ({ where }: any) => payouts.find(p => matches(p, where)) ?? null
			),
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
				{ realizedRevenue: found.realizedRevenue, paidOut: found.paidOut }
			];
		}),

		$transaction: mock(async (fn: any) => fn(client))
	};

	return {
		client,
		tables: {
			stores,
			accounts,
			journals,
			entries,
			statement,
			payouts,
			payoutAccounts
		}
	};
};
