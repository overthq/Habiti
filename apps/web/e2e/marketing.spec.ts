import { expect, test } from './fixtures';

for (const path of [
	'/about',
	'/support',
	'/privacy-policy',
	'/acceptable-use'
]) {
	test(`renders ${path} @mobile`, async ({ page }) => {
		const response = await page.goto(path);

		expect(response?.status()).toBe(200);
		await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
	});
}

test('shows a not-found page for an unknown product', async ({ page }) => {
	await page.goto('/product/00000000-0000-0000-0000-000000000000');

	await expect(
		page.getByRole('heading', { name: 'Page not found' })
	).toBeVisible();
	await page.getByRole('link', { name: 'Back to home' }).click();
	await expect(
		page.getByRole('heading', { name: 'Featured products' })
	).toBeVisible();
});

test('shows a not-found page for an unknown store', async ({ page }) => {
	await page.goto('/store/00000000-0000-0000-0000-000000000000');

	await expect(
		page.getByRole('heading', { name: 'Page not found' })
	).toBeVisible();
});
