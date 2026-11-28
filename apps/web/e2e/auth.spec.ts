import { expect, scenario, signIn, test, verificationCode } from './fixtures';

test('signs up with a new account @mobile', async ({ page }) => {
	const email = `new-${Date.now()}@e2e.habiti.test`;

	await page.goto('/');
	await page.getByRole('button', { name: 'Sign in' }).click();
	await page
		.getByRole('dialog', { name: 'Log in' })
		.getByRole('button', { name: 'Sign up' })
		.click();

	const signup = page.getByRole('dialog', { name: 'Sign up' });
	await signup.getByLabel('Name').fill('Chiamaka Eze');
	await signup.getByLabel('Email').fill(email);
	await signup.getByRole('button', { name: 'Create account' }).click();

	const verify = page.getByRole('dialog', { name: 'Verify your code' });
	await verify.getByLabel('Verification code').fill(verificationCode(email));
	await verify.getByRole('button', { name: 'Submit' }).click();
	await expect(page.getByRole('button', { name: 'Account' })).toBeVisible();

	await page.goto('/profile');
	await expect(
		page.getByRole('heading', { name: 'Chiamaka Eze', level: 1 })
	).toBeVisible();
	await expect(page.getByText(email)).toBeVisible();
});

test('signs in to an existing account', async ({ page }) => {
	const { shopper } = scenario('shopperWithCart');

	await page.goto('/');
	await signIn(page, shopper.email);

	await page.goto('/profile');
	await expect(
		page.getByRole('heading', { name: shopper.name, level: 1 })
	).toBeVisible();
});

test('rejects a wrong verification code', async ({ page }) => {
	const { shopper } = scenario('shopperWithCart');

	await page.goto('/');
	await page.getByRole('button', { name: 'Sign in' }).click();
	const login = page.getByRole('dialog', { name: 'Log in' });
	await login.getByLabel('Email').fill(shopper.email);
	await login.getByRole('button', { name: 'Send login link' }).click();

	const verify = page.getByRole('dialog', { name: 'Verify your code' });
	await verify.getByLabel('Verification code').fill('123456');
	await verify.getByRole('button', { name: 'Submit' }).click();

	await expect(page.getByText(/invalid|incorrect|expired/i)).toBeVisible();
	await expect(verify).toBeVisible();
});

test('signs out', async ({ page }) => {
	const { shopper } = scenario('shopperWithCart');

	await page.goto('/');
	await signIn(page, shopper.email);

	await page.getByRole('button', { name: 'Account' }).click();
	await page.getByRole('menuitem', { name: 'Logout' }).click();

	await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
	await page.goto('/orders');
	await expect(page.getByRole('heading', { name: 'Orders' })).toHaveCount(0);
});
