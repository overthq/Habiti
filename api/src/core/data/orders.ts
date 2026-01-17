import {
	Prisma,
	OrderStatus,
	PrismaClient
} from '../../generated/prisma/client';
import { OrderFilters, orderFiltersToPrismaClause } from '../../utils/queries';

type TransactionClient = Omit<
	PrismaClient,
	'$connect' | '$disconnect' | '$on' | '$transaction' | '$extends'
>;

// Utility function to calculate order data from cart products
export const getOrderData = (
	products: Prisma.CartProductGetPayload<{
		include: { product: true };
	}>[]
) => {
	let total = 0;

	const orderData = products.map(p => {
		total += p.product.unitPrice * p.quantity;

		return {
			productId: p.productId,
			unitPrice: p.product.unitPrice,
			quantity: p.quantity
		};
	});

	return { orderData, total };
};

interface IncrementStoreOrderCountParams {
	storeId: string;
	incrementUnrealizedRevenue?: number | undefined;
}

export const incrementStoreOrderCount = async (
	prisma: TransactionClient,
	params: IncrementStoreOrderCountParams
) => {
	const { storeId, incrementUnrealizedRevenue } = params;

	const store = await prisma.store.update({
		where: { id: storeId },
		data: {
			orderCount: { increment: 1 },
			...(incrementUnrealizedRevenue
				? { unrealizedRevenue: { increment: incrementUnrealizedRevenue } }
				: {})
		}
	});

	return store;
};

interface CreateOrderWithProductsParams {
	userId: string;
	storeId: string;
	serialNumber: number;
	orderData: { productId: string; unitPrice: number; quantity: number }[];
	total: number;
	transactionFee: number;
	serviceFee: number;
	status: OrderStatus;
}

export const createOrderWithProducts = async (
	prisma: TransactionClient,
	params: CreateOrderWithProductsParams
) => {
	const order = await prisma.order.create({
		data: {
			userId: params.userId,
			storeId: params.storeId,
			serialNumber: params.serialNumber,
			products: { createMany: { data: params.orderData } },
			total: params.total,
			transactionFee: params.transactionFee,
			serviceFee: params.serviceFee,
			status: params.status
		},
		include: {
			user: { include: { pushTokens: true } }
		}
	});

	return order;
};

interface DecrementProductQuantitiesParams {
	products: { productId: string; quantity: number }[];
}

export const decrementProductQuantities = async (
	prisma: TransactionClient,
	params: DecrementProductQuantitiesParams
) => {
	for (const product of params.products) {
		await prisma.product.update({
			where: { id: product.productId },
			data: {
				quantity: { decrement: product.quantity }
			}
		});
	}
};

interface CreateOrderParams {
	userId: string;
	storeId: string;
	total: number;
	transactionFee?: number;
	serviceFee?: number;
	status?: OrderStatus;
}

export const createOrder = async (
	prisma: PrismaClient,
	params: CreateOrderParams
) => {
	const order = await prisma.$transaction(async p => {
		const store = await p.store.update({
			where: { id: params.storeId },
			data: { orderCount: { increment: 1 } }
		});

		return p.order.create({
			data: {
				userId: params.userId,
				storeId: params.storeId,
				serialNumber: store.orderCount,
				total: params.total,
				transactionFee: params.transactionFee ?? 0,
				serviceFee: params.serviceFee ?? 0,
				status: params.status ?? OrderStatus.Pending
			}
		});
	});

	return order;
};

interface UpdateOrderParams {
	status?: OrderStatus;
	total?: number;
	transactionFee?: number;
	serviceFee?: number;
}

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
	userId: string,
	query: Prisma.OrderFindManyArgs
) => {
	const orders = await prisma.order.findMany({
		where: { userId },
		include: {
			store: { include: { image: true } },
			products: {
				include: {
					product: { include: { images: true } }
				}
			}
		},
		orderBy: { createdAt: 'desc' },
		...query
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
					product: { include: { images: true } }
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

export const getOrders = async (
	prisma: PrismaClient,
	filters?: OrderFilters
) => {
	const { where, orderBy } = orderFiltersToPrismaClause(filters);

	const orders = await prisma.order.findMany({
		where,
		orderBy: orderBy ?? { createdAt: 'desc' },
		include: { store: true, user: true }
	});

	return orders;
};
