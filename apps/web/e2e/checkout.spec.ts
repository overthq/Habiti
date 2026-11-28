import type { Page } from '@playwright/test';

import { expect, outbox, scenario, signIn, test } from './fixtures';

const openCheckout = async (page: Page, storeName: string) => {
	await page.goto('/cart');
	const cart = page.getByRole('region', { name: storeName });
	await cart.getByRole('link', { name: 'Checkout' }).click();
	await expect(page.getByRole('heading', { name: 'Summary' })).toBeVisible();
};

const payInPopup = async (page: Page, action: () => Promise<void>) => {
	const popupPromise = page.waitForEvent('popup');
	await action();
	const popup = await popupPromise;
	await popup.getByRole('button', { name: 'Pay' }).click();
	await popup.waitForEvent('close');
};

const expectPaid = async (page: Page) => {
	// The order page does not poll, so reload until the webhook has landed.
	await expect(async () => {
		await page.reload();
		await expect(page.getByText('Payment Pending')).toHaveCount(0);
	}).toPass({ timeout: 15_000 });
};

test('pays with a new card @mobile', async ({ page }) => {
	const { shopper, store, products } = scenario('shopperWithCart');

	await page.goto('/');
	await signIn(page, shopper.email);
	await openCheckout(page, store.name);

	await payInPopup(page, () =>
		page.getByRole('button', { name: 'Place Order' }).click()
	);

	await expect(page).toHaveURL(/\/orders\/[\w-]+$/, { timeout: 15_000 });
	await expect(page.getByText(products[0].name)).toBeVisible();
	await expectPaid(page);

	const orderId = page.url().split('/').pop();
	await expect
		.poll(() =>
			outbox().some(
				m => m.data.type === 'NEW_ORDER' && m.data.orderId === orderId
			)
		)
		.toBe(true);

	await page.goto('/profile/settings');
	await expect(page.getByText('visa *4081')).toBeVisible();
});

test('pays with a saved card', async ({ page }) => {
	const { shopper, store, card } = scenario('shopperWithSavedCard');

	await page.goto('/');
	await signIn(page, shopper.email);
	await openCheckout(page, store.name);

	await page.getByRole('combobox').click();
	await page.getByRole('option', { name: `Visa *${card.last4}` }).click();
	await page.getByRole('button', { name: 'Place Order' }).click();

	await expect(page).toHaveURL(/\/orders\/[\w-]+$/, { timeout: 15_000 });
	await expectPaid(page);
});

test('recovers from a declined saved card', async ({ page }) => {
	const { shopper, store, card } = scenario('shopperWithDecliningCard');

	await page.goto('/');
	await signIn(page, shopper.email);
	await openCheckout(page, store.name);

	await page.getByRole('combobox').click();
	await page.getByRole('option', { name: `Visa *${card.last4}` }).click();
	await page.getByRole('button', { name: 'Place Order' }).click();

	await expect(page).toHaveURL(/\/orders\/[\w-]+$/, { timeout: 15_000 });
	await expect(page.getByText('Payment Pending')).toBeVisible();

	await payInPopup(page, () =>
		page.getByRole('button', { name: 'Complete Payment' }).click()
	);
	await expectPaid(page);
});

test('completes payment for an unpaid order', async ({ page }) => {
	const { shopper, order } = scenario('shopperWithUnpaidOrder');

	await page.goto('/');
	await signIn(page, shopper.email);
	await page.goto(`/orders/${order.id}`);
	await expect(page.getByText('Payment Pending')).toBeVisible();

	await payInPopup(page, () =>
		page.getByRole('button', { name: 'Complete Payment' }).click()
	);
	await expectPaid(page);
});
