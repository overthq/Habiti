import { expect, signIn, test } from '../fixtures';

// Run by e2e/order-journey.ts, which passes in the dashboard steps' state.

const journey = {
	shopperEmail: process.env.JOURNEY_SHOPPER_EMAIL!,
	storeId: process.env.JOURNEY_STORE_ID!,
	storeName: process.env.JOURNEY_STORE_NAME!,
	productName: process.env.JOURNEY_PRODUCT_NAME!
};

test('buys the product the merchant just listed', async ({ page }) => {
	test.skip(process.env.JOURNEY_STEP !== 'buy');

	await page.goto(`/store/${journey.storeId}`);
	await signIn(page, journey.shopperEmail);
	await page
		.getByRole('link', { name: new RegExp(journey.productName) })
		.click();
	await page.getByRole('button', { name: 'Add to cart' }).click();
	await expect(page.getByRole('button', { name: 'In cart' })).toBeVisible();

	await page.goto('/cart');
	await page
		.getByRole('region', { name: journey.storeName })
		.getByRole('link', { name: 'Checkout' })
		.click();

	const popupPromise = page.waitForEvent('popup');
	await page.getByRole('button', { name: 'Place Order' }).click();
	const popup = await popupPromise;
	await popup.getByRole('button', { name: 'Pay' }).click();

	await expect(page).toHaveURL(/\/orders\/[\w-]+$/, { timeout: 15_000 });
	await expect(async () => {
		await page.reload();
		await expect(page.getByText('Payment Pending')).toHaveCount(0);
	}).toPass({ timeout: 15_000 });
});

test('collects the order the merchant got ready', async ({ page }) => {
	test.skip(process.env.JOURNEY_STEP !== 'collect');

	await page.goto('/');
	await signIn(page, journey.shopperEmail);
	await page.goto('/orders');
	await page.getByRole('link', { name: new RegExp(journey.storeName) }).click();

	await expect(page.getByText('Your order is ready for pickup.')).toBeVisible();
	await page.getByRole('button', { name: 'Confirm Pickup' }).click();
	await expect(async () => {
		await page.reload();
		await expect(page.getByText('Your order is ready for pickup.')).toHaveCount(
			0
		);
	}).toPass({ timeout: 10_000 });
});
