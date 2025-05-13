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
	const { cardId, storeId, cart, products, transactionFee, serviceFee } =
		params;
	const { orderData, total } = getOrderData(products);

	const order = await ctx.prisma.$transaction(async prisma => {
		const store = await prisma.store.update({
			where: { id: storeId },
			data: {
				orderCount: { increment: 1 },
				...(cardId ? { unrealizedRevenue: { increment: total } } : {})
			}
		});

		const newOrder = await prisma.order.create({
			data: {
				userId: ctx.user.id,
				storeId,
				serialNumber: store.orderCount,
				products: { createMany: { data: orderData } },
				total,
				transactionFee,
				serviceFee,
				status: cardId ? OrderStatus.PaymentPending : OrderStatus.Pending
			}
		});

		await prisma.cart.delete({ where: { id: cart.id } });

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
