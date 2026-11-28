import prisma from '../config/prisma';
import { OrderStatus, ProductStatus } from '../generated/prisma/client';
import {
	createAddress,
	createAdmin,
	createCard,
	createCart,
	createCategory,
	createOrder,
	createPayoutAccount,
	createProduct,
	createStore,
	createUser,
	fundStore
} from '../test/factories';

export const SEED_ACCOUNTS = {
	merchant: 'merchant@e2e.habiti.test',
	shopper: 'shopper@e2e.habiti.test',
	admin: { email: 'admin@e2e.habiti.test', password: 'password' }
} as const;

export const seed = async () => {
	const merchant = await createUser(prisma, {
		name: 'Tolu Merchant',
		email: SEED_ACCOUNTS.merchant
	});
	const shopper = await createUser(prisma, {
		name: 'Ada Shopper',
		email: SEED_ACCOUNTS.shopper
	});
	await createAdmin(prisma, SEED_ACCOUNTS.admin);

	const threads = await createStore(prisma, {
		managerId: merchant.id,
		name: 'Lagos Threads',
		description: 'Everyday clothing, made in Lagos.'
	});
	const kitchen = await createStore(prisma, {
		managerId: merchant.id,
		name: 'Mama Put Kitchen',
		description: 'Spices, sauces and pantry staples.'
	});

	const tops = await createCategory(prisma, {
		storeId: threads.id,
		name: 'Tops'
	});
	const bottoms = await createCategory(prisma, {
		storeId: threads.id,
		name: 'Bottoms'
	});

	const [shirt, trousers] = [
		await createProduct(prisma, {
			storeId: threads.id,
			name: 'Adire Shirt',
			description: 'Hand-dyed cotton shirt.',
			unitPrice: 1_850_000,
			options: { Size: ['S', 'M', 'L'], Colour: ['Indigo', 'Rust'] },
			categoryIds: [tops.id]
		}),
		await createProduct(prisma, {
			storeId: threads.id,
			name: 'Linen Trousers',
			description: 'Relaxed fit, breathable linen.',
			unitPrice: 2_400_000,
			options: { Size: ['30', '32', '34'] },
			categoryIds: [bottoms.id]
		})
	];
	await createProduct(prisma, {
		storeId: threads.id,
		name: 'Ankara Tote',
		unitPrice: 650_000,
		quantity: 0
	});
	await createProduct(prisma, {
		storeId: threads.id,
		name: 'Unreleased Jacket',
		status: ProductStatus.Draft
	});

	const pepper = await createProduct(prisma, {
		storeId: kitchen.id,
		name: 'Ata Rodo Pepper Sauce',
		unitPrice: 350_000,
		quantity: 40
	});
	await createProduct(prisma, {
		storeId: kitchen.id,
		name: 'Suya Spice',
		unitPrice: 200_000,
		quantity: 60
	});

	await createAddress(prisma, { userId: shopper.id });
	await createCard(prisma, { userId: shopper.id, email: shopper.email! });
	await createCart(prisma, {
		userId: shopper.id,
		storeId: kitchen.id,
		items: [{ productId: pepper.id, quantity: 2 }]
	});
	await prisma.storeFollower.create({
		data: { storeId: threads.id, followerId: shopper.id }
	});

	await createOrder(prisma, {
		userId: shopper.id,
		storeId: threads.id,
		products: [shirt]
	});
	await createOrder(prisma, {
		userId: shopper.id,
		storeId: threads.id,
		products: [trousers],
		status: OrderStatus.ReadyForPickup
	});
	await createOrder(prisma, {
		userId: shopper.id,
		storeId: threads.id,
		products: [shirt, trousers],
		status: OrderStatus.Completed
	});

	await fundStore(prisma, { storeId: threads.id, amount: 5_000_000 });
	await createPayoutAccount(prisma, { storeId: threads.id });
};

if (import.meta.main) {
	await seed();
	await prisma.$disconnect();
	console.log('Seeded. Accounts:', SEED_ACCOUNTS);
}
