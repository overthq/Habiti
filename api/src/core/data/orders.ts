import { Cart, OrderStatus, Product, PrismaClient } from '@prisma/client';
import { chargeAuthorization } from '../../utils/paystack';

interface CreateOrderParams {
	storeId: string;
	total: number;
	transactionFee?: number;
	serviceFee?: number;
	status?: OrderStatus;
}

interface UpdateOrderParams {
	status?: OrderStatus;
	total?: number;
	transactionFee?: number;
	serviceFee?: number;
}

interface SaveOrderDataParams {
	cardId?: string | undefined | null;
	storeId: string;
	cart: Cart;
	products: Product[];
	transactionFee: number;
	serviceFee: number;
}

export const saveOrderData = async (
	prisma: PrismaClient,
	userId: string,
	params: SaveOrderDataParams
) => {
	const { cardId, storeId, cart, products, transactionFee, serviceFee } =
		params;
	const { orderData, total } = getOrderData(products);

	const order = await prisma.$transaction(async prisma => {
		const store = await prisma.store.update({
			where: { id: storeId },
			data: {
				orderCount: { increment: 1 },
				...(cardId ? { unrealizedRevenue: { increment: total } } : {})
			}
		});

		const newOrder = await prisma.order.create({
			data: {
				userId,
				storeId,
				serialNumber: store.orderCount,
				products: { createMany: { data: orderData } },
				total,
				transactionFee,
				serviceFee,
				status: cardId ? OrderStatus.Pending : OrderStatus.PaymentPending
			},
			include: {
				user: { include: { pushTokens: true } }
			}
		});

		await prisma.cart.delete({ where: { id: cart.id } });

		await prisma.product.updateMany({
			where: { id: { in: products.map(p => p.id) } },
			data: {
				quantity: {
					decrement: products.reduce((acc, p) => acc + p.quantity, 0)
				}
			}
		});

		if (cardId) {
			const card = await prisma.card.findUnique({
				where: { id: cardId }
			});

			if (!card) {
				throw new Error(`No card found with the provided id: ${cardId}`);
			}

			try {
				await chargeAuthorization({
					email: card.email,
					amount: String(total),
					authorizationCode: card.authorizationCode
				});
			} catch (error) {
				console.error(error);
				throw new Error('Failed to charge card');
			}
		}

		return newOrder;
	});

	return order;
};

const getOrderData = (products: Product[]) => {
	let total = 0;

	const orderData = products.map(p => {
		total += p.unitPrice * p.quantity;
		return { productId: p.id, unitPrice: p.unitPrice, quantity: p.quantity };
	});

	return { orderData, total };
};

export const createOrder = async (
	prisma: PrismaClient,
	userId: string,
	params: CreateOrderParams
) => {
	const store = await prisma.store.update({
		where: { id: params.storeId },
		data: { orderCount: { increment: 1 } }
	});

	const order = await prisma.order.create({
		data: {
			userId,
			storeId: params.storeId,
			serialNumber: store.orderCount,
			total: params.total,
			transactionFee: params.transactionFee ?? 0,
			serviceFee: params.serviceFee ?? 0,
			status: params.status ?? OrderStatus.Pending
		}
	});

	return order;
};

export const updateOrder = async (
	prisma: PrismaClient,
	orderId: string,
	params: UpdateOrderParams
) => {
	const order = await prisma.order.update({
		where: { id: orderId },
		data: params,
		include: {
			products: { include: { product: true } },
			store: true,
			user: { include: { pushTokens: true } }
		}
	});

	return order;
};

export const getOrderById = async (prisma: PrismaClient, orderId: string) => {
	const order = await prisma.order.findUnique({
		where: { id: orderId },
		include: {
			store: {
				include: { image: true }
			},
			user: true,
			products: {
				include: {
					product: {
						include: { images: true }
					}
				}
			}
		}
	});

	return order;
};

export const getOrdersByUserId = async (
	prisma: PrismaClient,
	userId: string
) => {
	const orders = await prisma.order.findMany({
		where: { userId },
		include: {
			store: {
				include: { image: true }
			},
			products: {
				include: {
					product: {
						include: { images: true }
					}
				}
			}
		},
		orderBy: { createdAt: 'desc' }
	});

	return orders;
};

export const getOrdersByStoreId = async (
	prisma: PrismaClient,
	storeId: string
) => {
	const orders = await prisma.order.findMany({
		where: { storeId },
		include: {
			user: true,
			products: {
				include: {
					product: {
						include: { images: true }
					}
				}
			}
		},
		orderBy: { createdAt: 'desc' }
	});

	return orders;
};

export const cancelOrder = async (prisma: PrismaClient, orderId: string) => {
	const order = await prisma.order.update({
		where: { id: orderId },
		data: { status: OrderStatus.Cancelled }
	});

	return order;
};

export const fulfillOrder = async (prisma: PrismaClient, orderId: string) => {
	const order = await prisma.order.update({
		where: { id: orderId },
		data: { status: OrderStatus.Completed }
	});

	return order;
};
