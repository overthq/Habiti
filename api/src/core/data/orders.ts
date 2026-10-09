import {
	AccountKind,
	LedgerReason,
	Prisma,
	OrderStatus,
	PrismaClient
} from '../../generated/prisma/client';
import { OrderFilters, orderFiltersToPrismaClause } from '../../utils/queries';
import { LogicError, LogicErrorCode } from '../logic/errors';
import type { TransactionClient } from '../../generated/prisma/internal/prismaNamespace';
import { moveMoney } from './ledger';

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
}

export const incrementStoreOrderCount = async (
	prisma: TransactionClient,
	params: IncrementStoreOrderCountParams
) => {
	const { storeId } = params;

	const store = await prisma.store.update({
		where: { id: storeId },
		data: {
			orderCount: { increment: 1 }
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

/**
 * Atomic check-and-decrement: a single `updateMany` with `quantity >= q`
 * means concurrent orders for the last unit can't both succeed — the loser
 * matches 0 rows and we throw. Must run inside a `prisma.$transaction` block.
 */
export const decrementProductQuantities = async (
	prisma: TransactionClient,
	params: DecrementProductQuantitiesParams
) => {
	for (const { productId, quantity } of params.products) {
		const res = await prisma.product.updateMany({
			where: { id: productId, quantity: { gte: quantity } },
			data: { quantity: { decrement: quantity } }
		});

		if (res.count === 0) {
			throw new LogicError(LogicErrorCode.ProductInsufficientStock);
		}
	}

	const productIds = params.products.map(p => p.productId);

	const updated = await prisma.product.findMany({
		where: { id: { in: productIds } }
	});

	return updated;
};

interface RestoreProductQuantitiesParams {
	products: { productId: string; quantity: number }[];
}

export const restoreProductQuantities = async (
	prisma: TransactionClient,
	params: RestoreProductQuantitiesParams
) => {
	for (const { productId, quantity } of params.products) {
		await prisma.product.update({
			where: { id: productId },
			data: { quantity: { increment: quantity } }
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

interface OrderBeforeUpdate {
	id: string;
	storeId: string;
	userId: string;
	total: number;
	status: OrderStatus;
}

// Changes an order's status and moves the store's money to match, in the
// caller's transaction, so an order can never advance without its money.
export const updateOrderStatus = async (
	tx: TransactionClient,
	order: OrderBeforeUpdate,
	status: OrderStatus
) => {
	const updated = await tx.order.update({
		where: { id: order.id },
		data: { status },
		include: {
			products: { include: { product: true } },
			store: true,
			user: { include: { pushTokens: true } }
		}
	});

	const unrealized = { kind: AccountKind.Unrealized, storeId: order.storeId };

	if (status === OrderStatus.Completed) {
		await moveMoney(tx, {
			key: `order:${order.id}:completed`,
			reason: LedgerReason.OrderCompleted,
			amount: BigInt(order.total),
			from: unrealized,
			to: { kind: AccountKind.Available, storeId: order.storeId },
			description: 'Order completed',
			orderId: order.id
		});
	} else if (
		status === OrderStatus.Cancelled &&
		order.status !== OrderStatus.PaymentPending
	) {
		await moveMoney(tx, {
			key: `order:${order.id}:refunded`,
			reason: LedgerReason.OrderCancelledBeforeCompletion,
			amount: BigInt(order.total),
			from: unrealized,
			to: { kind: AccountKind.CustomerCredit, userId: order.userId },
			description: 'Order cancelled — refund',
			orderId: order.id
		});
	}

	return updated;
};

export const getOrderById = async (
	prisma: PrismaClient | TransactionClient,
	orderId: string
) => {
	const order = await prisma.order.findUnique({
		where: { id: orderId },
		include: {
			store: {
				include: { image: true, addresses: { take: 1 } }
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

export const getOrderByIdWithStore = async (
	prisma: PrismaClient,
	orderId: string
) => {
	const order = await prisma.order.findUnique({
		where: { id: orderId },
		include: { store: true }
	});

	return order;
};

export const getOrderByIdWithProducts = async (
	prisma: TransactionClient,
	orderId: string
) => {
	const order = await prisma.order.findUnique({
		where: { id: orderId },
		include: {
			store: true,
			products: true
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
			store: { include: { image: true, addresses: { take: 1 } } },
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
