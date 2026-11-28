import { expect, formatNaira, scenario, signIn, test } from './fixtures';

test('adds a product to the cart @mobile', async ({ page }) => {
	const { store, products } = scenario('storeWithProducts');
	const { shopper } = scenario('shopperWithCart');
	const [sneakers] = products;

	await page.goto(`/product/${sneakers.id}`);
	await signIn(page, shopper.email);

	await page.getByRole('button', { name: 'Increase quantity' }).click();
	await page.getByRole('button', { name: 'Add to cart' }).click();
	await expect(page.getByRole('button', { name: 'In cart' })).toBeVisible();

	await page.getByRole('link', { name: 'Cart' }).click();
	const cart = page.getByRole('region', { name: store.name });
	await expect(cart.getByText(sneakers.name)).toBeVisible();
	await expect(
		cart.getByText(formatNaira(sneakers.unitPrice * 2)).first()
	).toBeVisible();
});

test('carries a quantity change straight into checkout', async ({ page }) => {
	const { shopper, store, products } = scenario('shopperWithCart');
	const [sneakers, belt] = products;

	await page.goto('/');
	await signIn(page, shopper.email);
	await page.goto('/cart');

	const cart = page.getByRole('region', { name: store.name });
	await expect(
		cart.getByText(formatNaira(sneakers.unitPrice + belt.unitPrice), {
			exact: true
		})
	).toBeVisible();

	// Quantity changes are batched and sent after a pause, so leaving at once
	// is the case that can lose them.
	await cart
		.getByRole('listitem', { name: sneakers.name })
		.getByRole('button', { name: 'Increase quantity' })
		.click();
	await cart.getByRole('link', { name: 'Checkout' }).click();

	const total = formatNaira(sneakers.unitPrice * 2);
	await expect(page.getByText(total, { exact: true }).first()).toBeVisible();
	await page.reload();
	await expect(page.getByText(total, { exact: true }).first()).toBeVisible();
});

test('removes a product from the cart', async ({ page }) => {
	const { shopper, store, products } = scenario('shopperWithCart');
	const [sneakers, belt] = products;

	await page.goto('/');
	await signIn(page, shopper.email);
	await page.goto('/cart');

	const cart = page.getByRole('region', { name: store.name });
	await cart
		.getByRole('listitem', { name: sneakers.name })
		.getByRole('button', { name: 'Remove' })
		.click();

	await expect(cart.getByRole('listitem', { name: sneakers.name })).toHaveCount(
		0
	);
	await expect(cart.getByRole('listitem', { name: belt.name })).toBeVisible();

	await expect(async () => {
		await page.reload();
		await expect(
			page
				.getByRole('region', { name: store.name })
				.getByRole('listitem', { name: sneakers.name })
		).toHaveCount(0, { timeout: 2_000 });
	}).toPass({ timeout: 10_000 });
});

test('asks a guest to sign in before checking out', async ({ page }) => {
	const { store, products } = scenario('storeWithProducts');

	await page.goto(`/product/${products[1].id}`);
	await page.getByRole('button', { name: 'Add to cart' }).click();
	await expect(page.getByRole('button', { name: 'In cart' })).toBeVisible();

	await page.goto('/cart');
	await page
		.getByRole('region', { name: store.name })
		.getByRole('link', { name: 'Checkout' })
		.click();
	await page.getByRole('button', { name: 'Place Order' }).click();

	await expect(page.getByRole('dialog', { name: 'Log in' })).toBeVisible();
});
