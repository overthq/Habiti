import { Cart, Order, OrderStatus, Product } from '@prisma/client';
import { ResolverContext } from '../../types/resolvers';
import { chargeAuthorization } from '../../utils/paystack';

interface SaveOrderDataParams {
	cardId?: string | undefined;
	storeId: string;
	cart: Cart;
	products: Product[];
	transactionFee: number;
	serviceFee: number;
}

export const saveOrderData = async (
	ctx: ResolverContext,
	params: SaveOrderDataParams
) => {
	let order: Order;

	let total = 0;
	const orderData = params.products.map(p => {
		total += p.unitPrice * p.quantity;
		return {
			productId: p.id,
			unitPrice: p.unitPrice,
			quantity: p.quantity
		};
	});

	const { cardId } = params;

	if (!cardId) {
		order = await ctx.prisma.$transaction(async prisma => {
			const store = await prisma.store.update({
				where: { id: params.storeId },
				data: { orderCount: { increment: 1 } }
			});

			const [order] = await Promise.all([
				prisma.order.create({
					data: {
						userId: ctx.user.id,
						storeId: params.storeId,
						serialNumber: store.orderCount,
						products: { createMany: { data: orderData } },
						total,
						transactionFee: params.transactionFee,
						serviceFee: params.serviceFee,
						status: OrderStatus.PaymentPending
					}
				}),
				ctx.prisma.cart.delete({ where: { id: params.cart.id } })
			]);

			return order;
		});
	} else {
		// Execute all database operations and payment in a single transaction
		order = await ctx.prisma.$transaction(async prisma => {
			// Charge the card first - if this fails, no DB changes will be made
			const card = await prisma.card.findUnique({
				where: { id: cardId }
			});

			if (!card) {
				throw new Error(`No card found with the provided id: ${cardId}`);
			}

			await chargeAuthorization({
				email: card.email,
				amount: String(total),
				authorizationCode: card.authorizationCode
			});

			const store = await prisma.store.update({
				where: { id: params.storeId },
				data: {
					orderCount: { increment: 1 },
					unrealizedRevenue: { increment: total }
				}
			});

			const [order] = await Promise.all([
				prisma.order.create({
					data: {
						userId: ctx.user.id,
						storeId: params.storeId,
						serialNumber: store.orderCount,
						products: { createMany: { data: orderData } },
						total,
						transactionFee: params.transactionFee,
						serviceFee: params.serviceFee
					}
				}),
				prisma.cart.delete({ where: { id: params.cart.id } })
			]);

			return order;
		});
	}

	return order;
};
