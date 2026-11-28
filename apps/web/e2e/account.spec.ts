import { expect, scenario, signIn, test } from './fixtures';

test('lists orders and confirms a pickup', async ({ page }) => {
	const { shopper, store, orders } = scenario('storeWithOrders');

	await page.goto('/');
	await signIn(page, shopper.email);

	await page.goto('/orders');
	await expect(
		page.getByRole('link', { name: new RegExp(store.name) })
	).toHaveCount(3);

	await page.goto(`/orders/${orders.readyForPickup.id}`);
	await expect(page.getByText('Your order is ready for pickup.')).toBeVisible();
	await page.getByRole('button', { name: 'Confirm Pickup' }).click();

	await expect(async () => {
		await page.reload();
		await expect(page.getByText('Your order is ready for pickup.')).toHaveCount(
			0
		);
	}).toPass({ timeout: 10_000 });
});

test('updates the profile name', async ({ page }) => {
	const { shopper } = scenario('shopperWithCart');

	await page.goto('/');
	await signIn(page, shopper.email);
	await page.goto('/profile/settings');

	await page.getByLabel('Name').fill('Ngozi Adeyemi');
	await page.getByRole('button', { name: 'Save' }).click();
	await expect(page.getByText('Profile updated')).toBeVisible();

	await page.goto('/profile');
	await expect(
		page.getByRole('heading', { name: 'Ngozi Adeyemi', level: 1 })
	).toBeVisible();
});

test('removes a saved card', async ({ page }) => {
	const { shopper, card } = scenario('shopperWithSavedCard');

	await page.goto('/');
	await signIn(page, shopper.email);
	await page.goto('/profile/settings');

	await page
		.getByRole('button', { name: `Remove card ending ${card.last4}` })
		.click();

	await expect(page.getByText(`visa *${card.last4}`)).toHaveCount(0);
	await page.reload();
	await expect(
		page.getByRole('heading', { name: 'Payment Methods' })
	).toBeVisible();
	await expect(page.getByText(`visa *${card.last4}`)).toHaveCount(0);
});

test('deletes the account', async ({ page }) => {
	const { shopper } = scenario('shopperWithCart');

	await page.goto('/');
	await signIn(page, shopper.email);
	await page.goto('/profile/settings');

	await page.getByRole('button', { name: 'Delete account' }).click();
	await page
		.getByRole('alertdialog')
		.getByRole('button', { name: 'Confirm' })
		.click();

	await expect(page.getByText('Your account has been deleted')).toBeVisible();
	await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();

	await page.getByRole('button', { name: 'Sign in' }).click();
	const login = page.getByRole('dialog', { name: 'Log in' });
	await login.getByLabel('Email').fill(shopper.email);
	await login.getByRole('button', { name: 'Send login link' }).click();
	await expect(page.getByText('User not found')).toBeVisible();
});

test('creates a store from the sell page', async ({ page }) => {
	const { shopper } = scenario('shopperWithCart');
	const storeName = `Okra Studio ${Date.now()}`;

	await page.goto('/sell');
	await signIn(page, shopper.email);

	await page.getByLabel('Store name').fill(storeName);
	await page.getByLabel('Store description').fill('Ceramics from Abeokuta.');
	await page.getByRole('button', { name: 'Create store' }).click();

	await expect(
		page.getByRole('heading', { name: `${storeName} is live` })
	).toBeVisible();
});
