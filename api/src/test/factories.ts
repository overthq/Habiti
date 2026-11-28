import argon2 from 'argon2';
import { randomUUID } from 'crypto';

import {
	AccountKind,
	LedgerReason,
	OrderStatus,
	ProductStatus,
	PushTokenType
} from '../generated/prisma/client';
import type { PrismaClient } from '../config/prisma';
import { moveMoney } from '../core/data/ledger';
import * as OrderData from '../core/data/orders';
import { storeImage } from '../utils/upload';

const SAMPLE_PNG = Buffer.from(
	'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN4+P//fwAJhAPm5DGFMwAAAABJRU5ErkJggg==',
	'base64'
);

let sampleImage: ReturnType<typeof storeImage> | undefined;

const getSampleImage = () =>
	(sampleImage ??= storeImage(SAMPLE_PNG, 'image/png'));

const suffix = () => randomUUID().slice(0, 8);

export const e2eEmail = (name: string) =>
	`${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${suffix()}@e2e.habiti.test`;

export const createUser = (
	prisma: PrismaClient,
	input: { name?: string; email?: string } = {}
) => {
	const name = input.name ?? 'Test Shopper';

	return prisma.user.create({
		data: { name, email: input.email ?? e2eEmail(name) }
	});
};

export const createStore = async (
	prisma: PrismaClient,
	input: { managerId: string; name?: string; description?: string }
) => {
	const store = await prisma.store.create({
		data: {
			name: input.name ?? `Store ${suffix()}`,
			description: input.description ?? 'A store created for testing.',
			managers: { create: { managerId: input.managerId } },
			addresses: {
				create: {
					name: 'Main shop',
					line1: '12 Admiralty Way',
					city: 'Lekki',
					state: 'Lagos',
					country: 'Nigeria'
				}
			}
		}
	});

	await prisma.userPushToken.upsert({
		where: {
			userId_token: {
				userId: input.managerId,
				token: `ExponentPushToken[e2e-${input.managerId}]`
			}
		},
		update: {},
		create: {
			userId: input.managerId,
			token: `ExponentPushToken[e2e-${input.managerId}]`,
			type: PushTokenType.Merchant
		}
	});

	return store;
};

export const createProduct = async (
	prisma: PrismaClient,
	input: {
		storeId: string;
		name?: string;
		description?: string;
		unitPrice?: number;
		quantity?: number;
		status?: ProductStatus;
		options?: Record<string, string[]>;
		categoryIds?: string[];
	}
) =>
	prisma.product.create({
		data: {
			storeId: input.storeId,
			name: input.name ?? `Product ${suffix()}`,
			description: input.description ?? 'A product created for testing.',
			unitPrice: input.unitPrice ?? 500_000,
			quantity: input.quantity ?? 10,
			status: input.status ?? ProductStatus.Active,
			images: {
				create: {
					path: (await getSampleImage()).url,
					publicId: `e2e-${suffix()}`
				}
			},
			options: {
				create: Object.entries(input.options ?? {}).map(([name, values]) => ({
					name,
					values: { create: values.map(value => ({ name: value })) }
				}))
			},
			categories: {
				create: (input.categoryIds ?? []).map(categoryId => ({ categoryId }))
			}
		}
	});

export const createCategory = (
	prisma: PrismaClient,
	input: { storeId: string; name?: string }
) =>
	prisma.storeProductCategory.create({
		data: { storeId: input.storeId, name: input.name ?? `Category ${suffix()}` }
	});

export const createCart = (
	prisma: PrismaClient,
	input: {
		userId: string;
		storeId: string;
		items: { productId: string; quantity?: number }[];
	}
) =>
	prisma.cart.create({
		data: {
			userId: input.userId,
			storeId: input.storeId,
			products: {
				create: input.items.map(item => ({
					productId: item.productId,
					quantity: item.quantity ?? 1
				}))
			}
		}
	});

export const createCard = (
	prisma: PrismaClient,
	input: { userId: string; email: string; declines?: boolean }
) =>
	prisma.card.create({
		data: {
			userId: input.userId,
			email: input.email,
			authorizationCode: `AUTH_${input.declines ? 'decline_' : ''}${suffix()}`,
			signature: `SIG_${suffix()}`,
			cardType: 'visa',
			last4: input.declines ? '0002' : '4081',
			expMonth: '12',
			expYear: '2030',
			bin: '408408',
			bank: 'Test Bank',
			countryCode: 'NG'
		}
	});

export const createAddress = (
	prisma: PrismaClient,
	input: { userId: string; name?: string }
) =>
	prisma.address.create({
		data: {
			userId: input.userId,
			name: input.name ?? 'Home',
			line1: '4 Bourdillon Road',
			city: 'Ikoyi',
			state: 'Lagos',
			country: 'Nigeria'
		}
	});

export const createOrder = async (
	prisma: PrismaClient,
	input: {
		userId: string;
		storeId: string;
		products: (
			| { id: string; unitPrice: number }
			| { product: { id: string; unitPrice: number }; quantity: number }
		)[];
		status?: OrderStatus;
	}
) => {
	const lines = input.products.map(item =>
		'product' in item ? item : { product: item, quantity: 1 }
	);
	const total = lines.reduce(
		(sum, line) => sum + line.product.unitPrice * line.quantity,
		0
	);
	const paid = input.status !== OrderStatus.PaymentPending;

	const order = await OrderData.createOrder(prisma, {
		userId: input.userId,
		storeId: input.storeId,
		total,
		status: paid ? OrderStatus.Pending : OrderStatus.PaymentPending
	});

	await prisma.orderProduct.createMany({
		data: lines.map(line => ({
			orderId: order.id,
			productId: line.product.id,
			unitPrice: line.product.unitPrice,
			quantity: line.quantity
		}))
	});

	if (!paid) return order;

	return prisma.$transaction(async tx => {
		await moveMoney(tx, {
			key: `order:${order.id}:paid`,
			reason: LedgerReason.OrderPaid,
			amount: BigInt(total),
			from: { kind: AccountKind.PlatformCash },
			to: { kind: AccountKind.Unrealized, storeId: input.storeId },
			description: 'Payment confirmed',
			orderId: order.id
		});

		if (!input.status || input.status === OrderStatus.Pending) return order;

		return OrderData.updateOrderStatus(tx, order, input.status);
	});
};

export const fundStore = (
	prisma: PrismaClient,
	input: { storeId: string; amount: number }
) =>
	prisma.$transaction(tx =>
		moveMoney(tx, {
			key: `store:${input.storeId}:opening:${suffix()}`,
			reason: LedgerReason.OpeningBalance,
			amount: BigInt(input.amount),
			from: { kind: AccountKind.PlatformCash },
			to: { kind: AccountKind.Available, storeId: input.storeId },
			description: 'Opening balance'
		})
	);

export const createPayoutAccount = (
	prisma: PrismaClient,
	input: { storeId: string; accountNumber?: string }
) =>
	prisma.storePayoutAccount.create({
		data: {
			storeId: input.storeId,
			accountNumber: input.accountNumber ?? '0123456789',
			bankCode: '058',
			bankName: 'Guaranty Trust Bank',
			accountName: 'E2E TEST ACCOUNT',
			recipientRef: `RCP_${input.accountNumber?.startsWith('999') ? 'fail_' : ''}${suffix()}`,
			isDefault: true,
			verifiedAt: new Date()
		}
	});

export const createAdmin = async (
	prisma: PrismaClient,
	input: { email?: string; password?: string; name?: string } = {}
) =>
	prisma.admin.create({
		data: {
			name: input.name ?? 'Test Admin',
			email: input.email ?? e2eEmail('admin'),
			passwordHash: await argon2.hash(input.password ?? 'password')
		}
	});

export const scenarios = {
	merchant: async (prisma: PrismaClient) => {
		const merchant = await createUser(prisma, { name: 'Test Merchant' });
		const store = await createStore(prisma, { managerId: merchant.id });

		return { merchant, store };
	},

	storeWithProducts: async (prisma: PrismaClient) => {
		const { merchant, store } = await scenarios.merchant(prisma);
		const category = await createCategory(prisma, {
			storeId: store.id,
			name: 'Shoes'
		});
		const products = await Promise.all([
			createProduct(prisma, {
				storeId: store.id,
				name: 'Canvas Sneakers',
				unitPrice: 2_500_000,
				options: { Size: ['41', '42', '43'] },
				categoryIds: [category.id]
			}),
			createProduct(prisma, {
				storeId: store.id,
				name: 'Leather Belt',
				unitPrice: 800_000
			}),
			createProduct(prisma, {
				storeId: store.id,
				name: 'Draft Hat',
				status: ProductStatus.Draft
			})
		]);

		return { merchant, store, category, products };
	},

	shopperWithCart: async (prisma: PrismaClient) => {
		const { merchant, store, products } =
			await scenarios.storeWithProducts(prisma);
		const shopper = await createUser(prisma);
		const cart = await createCart(prisma, {
			userId: shopper.id,
			storeId: store.id,
			items: [{ productId: products[0].id }, { productId: products[1].id }]
		});

		return { merchant, store, products, shopper, cart };
	},

	shopperWithSavedCard: async (prisma: PrismaClient) => {
		const result = await scenarios.shopperWithCart(prisma);
		const card = await createCard(prisma, {
			userId: result.shopper.id,
			email: result.shopper.email!
		});

		return { ...result, card };
	},

	shopperWithDecliningCard: async (prisma: PrismaClient) => {
		const result = await scenarios.shopperWithCart(prisma);
		const card = await createCard(prisma, {
			userId: result.shopper.id,
			email: result.shopper.email!,
			declines: true
		});

		return { ...result, card };
	},

	shopperWithUnpaidOrder: async (prisma: PrismaClient) => {
		const { merchant, store, products } =
			await scenarios.storeWithProducts(prisma);
		const shopper = await createUser(prisma);
		const order = await createOrder(prisma, {
			userId: shopper.id,
			storeId: store.id,
			products: [products[1]],
			status: OrderStatus.PaymentPending
		});

		return { merchant, store, products, shopper, order };
	},

	storeWithOrders: async (prisma: PrismaClient) => {
		const { merchant, store, products } =
			await scenarios.storeWithProducts(prisma);
		const shopper = await createUser(prisma, { name: 'Ada Obi' });
		const [pending, readyForPickup, completed] = [
			await createOrder(prisma, {
				userId: shopper.id,
				storeId: store.id,
				products: [products[0]]
			}),
			await createOrder(prisma, {
				userId: shopper.id,
				storeId: store.id,
				products: [products[1]],
				status: OrderStatus.ReadyForPickup
			}),
			await createOrder(prisma, {
				userId: shopper.id,
				storeId: store.id,
				products: [products[0], products[1]],
				status: OrderStatus.Completed
			})
		];

		return {
			merchant,
			store,
			products,
			shopper,
			orders: { pending, readyForPickup, completed }
		};
	},

	storeWithBalance: async (prisma: PrismaClient) => {
		const { merchant, store } = await scenarios.merchant(prisma);
		await fundStore(prisma, { storeId: store.id, amount: 10_000_000 });
		const payoutAccount = await createPayoutAccount(prisma, {
			storeId: store.id
		});

		return { merchant, store, payoutAccount };
	}
};

export type ScenarioName = keyof typeof scenarios;
