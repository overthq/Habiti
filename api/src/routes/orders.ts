import { and, eq } from 'drizzle-orm';
import { Router, Request, Response } from 'express';

import { APIException } from './types';
import { db } from '../db';
import { Order, OrderProduct } from '../db/schema';
import { authenticate } from '../middleware/auth';
import { buildQuery } from '../utils/filters';

const router: Router = Router();

// GET /orders
router.get('/', authenticate, async (req: Request, res: Response) => {
	const { filter, orderBy } = req.query;
	const baseQuery = buildQuery(Order, filter as any, orderBy as any);
	const orders = await db.query.Order.findMany({
		...baseQuery,
		where: eq(Order.userId, req.auth!.id)
	});
	res.json({ data: orders });
});

// GET /orders/:id
router.get('/:id', authenticate, async (req: Request, res: Response) => {
	const { id } = req.params;

	if (!id) {
		throw new APIException(400, 'Order id is required');
	}

	const order = await db.query.Order.findFirst({
		where: and(eq(Order.id, id), eq(Order.userId, req.auth!.id)),
		with: {
			products: { with: { product: true } },
			store: true
		}
	});

	if (!order) {
		throw new APIException(404, `Order with id ${id} not found`);
	}

	res.json({ data: order });
});

// POST /orders
router.post('/', authenticate, async (req: Request, res: Response) => {
	const { storeId, products, deliveryAddressId } = req.body;

	if (!req.auth?.id) {
		throw new APIException(401, 'User not authenticated');
	}

	// Validate products exist and belong to the same store
	const productIds = products.map((p: any) => p.productId);
	const existingProducts = await db.query.Product.findMany({
		where: (products, { inArray, and, eq }) =>
			and(inArray(products.id, productIds), eq(products.storeId, storeId))
	});

	if (existingProducts.length !== productIds.length) {
		throw new APIException(400, 'Invalid products selected');
	}

	// Calculate order total
	const total = existingProducts.reduce((sum, product) => {
		const orderProduct = products.find((p: any) => p.productId === product.id);
		return sum + product.unitPrice * (orderProduct?.quantity || 1);
	}, 0);

	// Create order
	const [order] = await db
		.insert(Order)
		.values({
			userId: req.auth!.id,
			storeId,
			total,
			// deliveryAddressId,
			status: 'Pending'
		})
		.returning();

	if (!order) {
		throw new APIException(500, 'Failed to create order');
	}

	// Create order products
	await db.insert(OrderProduct).values(
		products.map((p: any) => ({
			orderId: order.id,
			productId: p.productId,
			quantity: p.quantity,
			unitPrice:
				existingProducts.find(ep => ep.id === p.productId)?.unitPrice || 0
		}))
	);

	const createdOrder = await db.query.Order.findFirst({
		where: eq(Order.id, order.id),
		with: {
			products: { with: { product: true } },
			store: true
		}
	});

	res.status(201).json({ data: createdOrder });
});

// PUT /orders/:id/cancel
router.put('/:id/cancel', authenticate, async (req: Request, res: Response) => {
	const { id } = req.params;

	if (!id) {
		throw new APIException(400, 'Order id is required');
	}

	const order = await db.query.Order.findFirst({
		where: and(eq(Order.id, id), eq(Order.userId, req.auth!.id))
	});

	if (!order) {
		throw new APIException(404, `Order with id ${id} not found`);
	}

	if (order.status !== 'Pending') {
		throw new APIException(400, 'Only pending orders can be cancelled');
	}

	const [updatedOrder] = await db
		.update(Order)
		.set({ status: 'Cancelled' })
		.where(eq(Order.id, id))
		.returning();

	res.json({ data: updatedOrder });
});

export default router;
