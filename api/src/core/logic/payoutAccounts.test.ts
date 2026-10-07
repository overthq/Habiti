import { beforeEach, describe, expect, mock, test } from 'bun:test';

/**
 * Cover for the rules that keep a store's payout destination coherent: the
 * account cap, the refusal to invent details when the provider does not
 * confirm them, and the fact that replacing an account is never implicit.
 *
 * The provider is mocked; everything below it is the real logic running
 * against an in-memory stand-in for the two tables it touches.
 */

const resolveAccountNumber = mock(async (_options: any) => ({
	status: true,
	data: { account_number: '0123456789', account_name: 'Ada Obi' }
}));

const createTransferRecipient = mock(async (_options: any) => ({
	status: true,
	message: 'ok',
	data: {
		recipient_code: 'RCP_new',
		details: {
			account_number: '0123456789',
			account_name: 'Ada Obi',
			bank_code: '058',
			bank_name: 'Guaranty Trust Bank'
		}
	}
}));

mock.module('../payments', () => ({
	resolveAccountNumber,
	createTransferRecipient
}));

const { addPayoutAccount, MAX_PAYOUT_ACCOUNTS_PER_STORE } =
	await import('./payoutAccounts');
const { LogicErrorCode } = await import('./errors');

interface AccountRow {
	[key: string]: any;
}

const matches = (row: AccountRow, where: AccountRow): boolean =>
	Object.entries(where).every(([key, value]) => {
		if (value === undefined) return true;
		if (value && typeof value === 'object' && 'not' in value) {
			return row[key] !== (value as { not: unknown }).not;
		}
		return row[key] === value;
	});

const fakeContext = (accounts: AccountRow[], processingPayouts = 0) => {
	let ids = 0;

	const client: any = {
		storeManager: {
			findUnique: mock(async () => ({
				managerId: 'user-1',
				storeId: 'store-1'
			}))
		},
		storePayoutAccount: {
			findUnique: mock(async ({ where }: any) => {
				const key = where.storeId_provider_bankCode_accountNumber ?? where;
				return accounts.find(a => matches(a, key)) ?? null;
			}),
			findUniqueOrThrow: mock(async ({ where }: any) => {
				const found = accounts.find(a => matches(a, where));
				if (!found) throw new Error('not found');
				return found;
			}),
			findFirst: mock(
				async ({ where }: any) => accounts.find(a => matches(a, where)) ?? null
			),
			count: mock(
				async ({ where }: any) => accounts.filter(a => matches(a, where)).length
			),
			create: mock(async ({ data }: any) => {
				const row = { id: `account-${++ids}`, createdAt: new Date(), ...data };
				accounts.push(row);
				return { ...row };
			}),
			update: mock(async ({ where, data }: any) => {
				const found = accounts.find(a => matches(a, where));
				if (!found) throw new Error('not found');
				Object.assign(found, data);
				return { ...found };
			}),
			updateMany: mock(async ({ where, data }: any) => {
				const hits = accounts.filter(a => matches(a, where));
				hits.forEach(row => Object.assign(row, data));
				return { count: hits.length };
			})
		},
		payoutRequest: {
			count: mock(async () => processingPayouts)
		},
		$transaction: mock(async (fn: any) => fn(client))
	};

	const c = {
		var: {
			auth: { id: 'user-1', name: 'Manager Name' },
			storeId: 'store-1',
			prisma: client,
			services: { analytics: { track: mock(() => {}) } }
		}
	} as any;

	return { c, accounts };
};

const activeAccount = (overrides: AccountRow = {}) => ({
	id: 'account-existing',
	storeId: 'store-1',
	provider: 'paystack',
	accountNumber: '9999999999',
	bankCode: '011',
	accountName: 'Ada Obi',
	bankName: 'First Bank',
	recipientRef: 'RCP_old',
	label: null,
	isDefault: true,
	status: 'Active',
	createdAt: new Date(),
	...overrides
});

const expectLogicError = async (fn: () => Promise<unknown>, code: string) => {
	try {
		await fn();
	} catch (error) {
		expect((error as { code?: string }).code).toBe(code);
		return;
	}

	throw new Error(`expected a LogicError with code ${code}`);
};

const input = { accountNumber: '0123456789', bankCode: '058' };

beforeEach(() => {
	resolveAccountNumber.mockClear();
	createTransferRecipient.mockClear();
});

describe('addPayoutAccount', () => {
	test('stores the provider-resolved details, not the submitted ones', async () => {
		const { c, accounts } = fakeContext([]);

		const account = await addPayoutAccount(c, {
			accountNumber: '0123456789  ',
			bankCode: '058'
		});

		expect(account.accountName).toBe('Ada Obi');
		expect(account.bankName).toBe('Guaranty Trust Bank');
		expect(accounts[0]?.recipientRef).toBe('RCP_new');

		// The recipient must be named for the account holder. Naming it after
		// the signed-in manager is the bug this replaced.
		expect(createTransferRecipient).toHaveBeenCalledWith(
			expect.objectContaining({ name: 'Ada Obi' })
		);
	});

	test('the first account a store attaches becomes its default', async () => {
		const { c, accounts } = fakeContext([]);

		await addPayoutAccount(c, input);

		expect(accounts[0]?.isDefault).toBe(true);
	});

	test('refuses to attach anything when the provider will not confirm the account', async () => {
		const { c, accounts } = fakeContext([]);

		resolveAccountNumber.mockImplementationOnce(async () => ({
			status: false,
			data: null as any
		}));

		await expectLogicError(
			() => addPayoutAccount(c, input),
			LogicErrorCode.BankAccountVerificationFailed
		);

		expect(accounts).toHaveLength(0);
		expect(createTransferRecipient).not.toHaveBeenCalled();
	});

	test('refuses to attach when the recipient call fails, rather than saving unpayable details', async () => {
		const { c, accounts } = fakeContext([]);

		createTransferRecipient.mockImplementationOnce(async () => ({
			status: false,
			message: 'nope',
			data: null as any
		}));

		await expectLogicError(
			() => addPayoutAccount(c, input),
			LogicErrorCode.BankAccountVerificationFailed
		);

		expect(accounts).toHaveLength(0);
	});

	test('re-adding the account a store already has is a no-op', async () => {
		const existing = activeAccount({
			accountNumber: '0123456789',
			bankCode: '058'
		});
		const { c, accounts } = fakeContext([existing]);

		const account = await addPayoutAccount(c, input);

		expect(account.id).toBe(existing.id);
		expect(accounts).toHaveLength(1);
		expect(createTransferRecipient).not.toHaveBeenCalled();
	});

	test('rejects a second account, and does not create a recipient for it', async () => {
		const { c, accounts } = fakeContext([activeAccount()]);

		await expectLogicError(
			() => addPayoutAccount(c, input),
			LogicErrorCode.PayoutAccountLimitReached
		);

		expect(accounts).toHaveLength(1);
		// Bailing before the provider call is what stops rejected attempts from
		// leaving orphaned transfer recipients behind at Paystack.
		expect(createTransferRecipient).not.toHaveBeenCalled();
	});

	test('replaces the current account only when asked to', async () => {
		const { c, accounts } = fakeContext([activeAccount()]);

		const account = await addPayoutAccount(c, {
			...input,
			replaceExisting: true
		});

		expect(account.accountNumber).toBe('0123456789');
		expect(account.isDefault).toBe(true);

		// The displaced account is detached, not deleted: payouts already sent to
		// it still have to resolve.
		const previous = accounts.find(a => a.id === 'account-existing');
		expect(previous?.status).toBe('Inactive');
		expect(previous?.isDefault).toBe(false);
		expect(accounts).toHaveLength(2);
	});

	test('will not replace an account with a payout still awaiting confirmation', async () => {
		const { c, accounts } = fakeContext([activeAccount()], 1);

		await expectLogicError(
			() => addPayoutAccount(c, { ...input, replaceExisting: true }),
			LogicErrorCode.PayoutAccountInUse
		);

		expect(accounts).toHaveLength(1);
		expect(accounts[0]?.status).toBe('Active');
	});

	test('re-adding a removed account still counts against the cap', async () => {
		const removed = activeAccount({
			id: 'account-removed',
			accountNumber: '0123456789',
			bankCode: '058',
			status: 'Inactive',
			isDefault: false
		});
		const { c, accounts } = fakeContext([activeAccount(), removed]);

		await expectLogicError(
			() => addPayoutAccount(c, input),
			LogicErrorCode.PayoutAccountLimitReached
		);

		expect(accounts.find(a => a.id === 'account-removed')?.status).toBe(
			'Inactive'
		);
	});

	test('brings a previously removed account back instead of duplicating it', async () => {
		const removed = activeAccount({
			id: 'account-removed',
			accountNumber: '0123456789',
			bankCode: '058',
			status: 'Inactive',
			isDefault: false,
			recipientRef: 'RCP_stale'
		});
		const { c, accounts } = fakeContext([removed]);

		const account = await addPayoutAccount(c, input);

		expect(account.id).toBe('account-removed');
		expect(accounts).toHaveLength(1);
		expect(accounts[0]?.status).toBe('Active');
		// A stale recipient may have been deactivated provider-side, so the
		// reactivated row takes the fresh code.
		expect(accounts[0]?.recipientRef).toBe('RCP_new');
	});
});

describe('the account cap', () => {
	test('is one, and the rules above are what enforce it', () => {
		expect(MAX_PAYOUT_ACCOUNTS_PER_STORE).toBe(1);
	});
});
