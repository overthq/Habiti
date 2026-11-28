import { execFileSync } from 'node:child_process';
import path from 'node:path';

import { expect, type Page } from '@playwright/test';

export { expect, test } from '@playwright/test';

export const API_DIR = path.resolve(import.meta.dirname, '../../../api');

const runE2ECommand = <T>(...args: string[]): T => {
	const output = execFileSync('bun', ['run', '--silent', 'e2e', ...args], {
		cwd: API_DIR,
		encoding: 'utf8'
	});
	const line = output.split('\n').find(l => l.startsWith('E2E_RESULT '));

	if (!line) {
		throw new Error(`\`e2e ${args.join(' ')}\` printed no result:\n${output}`);
	}

	return JSON.parse(line.slice('E2E_RESULT '.length));
};

type User = { id: string; name: string; email: string };
type Store = { id: string; name: string };
type Product = { id: string; name: string; unitPrice: number };
type Order = { id: string; total: number; status: string };

type Scenarios = {
	merchant: { merchant: User; store: Store };
	storeWithProducts: {
		merchant: User;
		store: Store;
		category: { id: string; name: string };
		products: [Product, Product, Product];
	};
	shopperWithCart: {
		merchant: User;
		store: Store;
		products: [Product, Product, Product];
		shopper: User;
		cart: { id: string };
	};
	shopperWithSavedCard: Scenarios['shopperWithCart'] & {
		card: { id: string; last4: string };
	};
	shopperWithDecliningCard: Scenarios['shopperWithSavedCard'];
	shopperWithUnpaidOrder: {
		merchant: User;
		store: Store;
		products: [Product, Product, Product];
		shopper: User;
		order: Order;
	};
	storeWithOrders: {
		merchant: User;
		store: Store;
		products: [Product, Product, Product];
		shopper: User;
		orders: { pending: Order; readyForPickup: Order; completed: Order };
	};
	storeWithBalance: {
		merchant: User;
		store: Store;
		payoutAccount: { id: string };
	};
};

export const scenario = <N extends keyof Scenarios>(name: N): Scenarios[N] =>
	runE2ECommand('scenario', name);

type PushMessage = {
	to: string;
	title: string;
	body: string;
	data: { type: string; [key: string]: unknown };
};

export const outbox = () => runE2ECommand<PushMessage[]>('outbox');

export const verificationCode = (email: string) =>
	runE2ECommand<string>('otp', email);

export const signIn = async (page: Page, email: string) => {
	// Some pages have their own "Sign in" button below the nav's.
	await page.getByRole('button', { name: 'Sign in' }).first().click();

	const login = page.getByRole('dialog', { name: 'Log in' });
	await login.getByLabel('Email').fill(email);
	await login.getByRole('button', { name: 'Send login link' }).click();

	const verify = page.getByRole('dialog', { name: 'Verify your code' });
	await verify.getByLabel('Verification code').fill(verificationCode(email));
	await verify.getByRole('button', { name: 'Submit' }).click();

	await expect(page.getByRole('button', { name: 'Account' })).toBeVisible();
};

export const formatNaira = (kobo: number) =>
	new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(
		kobo / 100
	);
