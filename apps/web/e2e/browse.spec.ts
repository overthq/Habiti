import { expect, formatNaira, scenario, signIn, test } from './fixtures';

test('home links through to products and stores @mobile', async ({ page }) => {
	scenario('storeWithProducts');

	await page.goto('/');
	await expect(
		page.getByRole('heading', { name: 'Featured products' })
	).toBeVisible();

	const featured = page.getByRole('region', { name: 'Featured products' });
	const firstProduct = featured.getByRole('link').first();
	const productName = await firstProduct
		.getByRole('paragraph')
		.first()
		.innerText();
	await firstProduct.click();
	await expect(
		page.getByRole('heading', { name: productName, level: 2 })
	).toBeVisible();

	await page.goto('/');
	const firstStore = page
		.getByRole('region', { name: 'Trending stores' })
		.getByRole('link')
		.first();
	const storeName = await firstStore.getByRole('paragraph').innerText();
	await firstStore.click();
	await expect(
		page.getByRole('heading', { name: storeName, level: 1 })
	).toBeVisible();
});

test('shows a product with its price and store', async ({ page }) => {
	const { store, products } = scenario('storeWithProducts');
	const [sneakers] = products;

	await page.goto(`/product/${sneakers.id}`);

	await expect(
		page.getByRole('heading', { name: sneakers.name, level: 2 })
	).toBeVisible();
	await expect(
		page.getByText(formatNaira(sneakers.unitPrice)).first()
	).toBeVisible();
	await page.getByRole('link', { name: store.name, exact: true }).click();
	await expect(
		page.getByRole('heading', { name: store.name, level: 1 })
	).toBeVisible();
});

test('filters a store by category', async ({ page }) => {
	const { store, category, products } = scenario('storeWithProducts');
	const [sneakers, belt] = products;

	await page.goto(`/store/${store.id}`);
	await expect(
		page.getByRole('link', { name: new RegExp(belt.name) })
	).toBeVisible();

	await page.getByRole('button', { name: category.name }).click();

	await expect(
		page.getByRole('link', { name: new RegExp(sneakers.name) })
	).toBeVisible();
	await expect(
		page.getByRole('link', { name: new RegExp(belt.name) })
	).toHaveCount(0);
});

test('finds a store through search', async ({ page }) => {
	const { store } = scenario('merchant');

	await page.goto('/');
	await page
		.getByRole('textbox', { name: 'Search products and stores' })
		.fill(store.name);
	await page.getByRole('button', { name: new RegExp(store.name) }).click();

	await expect(
		page.getByRole('heading', { name: store.name, level: 1 })
	).toBeVisible();
});

test('follows and unfollows a store', async ({ page }) => {
	const { store } = scenario('storeWithProducts');
	const { shopper } = scenario('shopperWithCart');

	await page.goto(`/store/${store.id}`);
	await signIn(page, shopper.email);

	await page.getByRole('button', { name: 'Follow', exact: true }).click();
	await expect(page.getByRole('button', { name: 'Following' })).toBeVisible();

	await page.goto('/profile');
	await expect(
		page
			.getByRole('region', { name: 'Followed stores' })
			.getByRole('link', { name: new RegExp(store.name) })
	).toBeVisible();

	await page.goto(`/store/${store.id}`);
	await page.getByRole('button', { name: 'Following' }).click();
	await expect(
		page.getByRole('button', { name: 'Follow', exact: true })
	).toBeVisible();
	await page.reload();
	await expect(
		page.getByRole('button', { name: 'Follow', exact: true })
	).toBeVisible();
});
