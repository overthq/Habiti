import { Request, Response } from 'express';

import prismaClient from '../config/prisma';
import { chargeAuthorization } from '../utils/paystack';
import { hydrateQuery } from '../utils/queries';

export default class OrderController {
	public async getOrders(req: Request, res: Response) {
		const query = hydrateQuery(req.query);

		const orders = await prismaClient.order.findMany({
			...query,
			include: { user: true, store: true }
		});

		return res.json({ orders });
	}

	public async createOrder(req: Request, res: Response) {
		const { cartId, cardId, transactionFee, serviceFee } = req.body;

		if (!req.auth) {
			return res.status(401).json({ error: 'User not authenticated' });
		}

		const userId = req.auth.id;

		const cart = await prismaClient.cart.findUnique({
			where: { id: cartId, userId },
			include: {
				user: { include: { cards: cardId ? { where: { id: cardId } } : true } },
				products: { include: { product: true } },
				store: true
			}
		});

		if (!cart) {
			return res.status(404).json({ error: 'Cart not found' });
		}

		const card = cart.user.cards[0];

		if (!card) {
			return res
				.status(400)
				.json({ error: 'Please add a card to authorize this transaction' });
		}

		let total = 0;
		const orderData = cart.products.map(p => {
			total += p.product.unitPrice * p.quantity;
			return {
				productId: p.productId,
				unitPrice: p.product.unitPrice,
				quantity: p.quantity
			};
		});

		// Execute all database operations and payment in a single transaction
		const order = await prismaClient.$transaction(async prisma => {
			// Charge the card first - if this fails, no DB changes will be made
			await chargeAuthorization({
				email: card.email,
				amount: String(total),
				authorizationCode: card.authorizationCode
			});

			const [, order] = await Promise.all([
				prisma.store.update({
					where: { id: cart.storeId },
					data: {
						orderCount: { increment: 1 },
						unrealizedRevenue: { increment: total }
					}
				}),
				prisma.order.create({
					data: {
						userId,
						storeId: cart.storeId,
						serialNumber: cart.store.orderCount + 1,
						products: { createMany: { data: orderData } },
						total,
						transactionFee,
						serviceFee
					}
				}),
				prisma.cart.delete({ where: { id: cartId } })
			]);

			return order;
		});

		return res.json({ order });
	}

	public async getOrderById(req: Request, res: Response) {
		const { id } = req.params;

		if (!id) {
			return res.status(400).json({ error: 'Order ID is required' });
		}

		const order = await prismaClient.order.findUnique({ where: { id } });

		if (!order) {
			return res.status(404).json({ error: 'Order not found' });
		}

		return res.json({ order });
	}
}
