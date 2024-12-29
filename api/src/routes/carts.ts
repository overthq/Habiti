import { and, eq } from 'drizzle-orm';
import { Router, Request, Response } from 'express';

import { APIException } from './types';
import { db } from '../db';
import { Cart, CartProduct, Product } from '../db/schema';
import { authenticate } from '../middleware/auth';

const router: Router = Router();

// GET /carts/:id
router.get('/:id', authenticate, async (req: Request, res: Response) => {
	const { id } = req.params;

	if (!id) {
		throw new APIException(400, 'Cart id is required');
	}

	const cart = await db.query.Cart.findFirst({
		where: and(eq(Cart.userId, req.auth!.id), eq(Cart.storeId, id)),
		with: { products: { with: { product: true } } }
	});

	if (!cart) {
		// Create a new cart if none exists
		const [newCart] = await db
			.insert(Cart)
			.values({
				userId: req.auth!.id,
				storeId: req.headers['x-market-store-id'] as string
			})
			.returning();

		return res.json({ data: { ...newCart, products: [] } });
	}

	res.json({ data: cart });
});

// POST /carts/current/products
router.post(
	'/current/products',
	authenticate,
	async (req: Request, res: Response) => {
		const { productId, quantity = 1 } = req.body;

		// Get or create cart
		let cart = await db.query.Cart.findFirst({
			where: and(
				eq(Cart.userId, req.auth!.id),
				eq(Cart.storeId, req.headers['x-market-store-id'] as string)
			)
		});

		if (!cart) {
			const [newCart] = await db
				.insert(Cart)
				.values({
					userId: req.auth!.id,
					storeId: req.headers['x-market-store-id'] as string
				})
				.returning();
			if (!newCart) {
				throw new APIException(500, 'Failed to create cart');
			}
			cart = newCart;
		}

		// Check if product exists and belongs to the store
		const product = await db.query.Product.findFirst({
			where: and(eq(Product.id, productId), eq(Product.storeId, cart.storeId))
		});

		if (!product) {
			throw new APIException(404, 'Product not found');
		}

		// Check if product is already in cart
		const existingCartProduct = await db.query.CartProduct.findFirst({
			where: and(
				eq(CartProduct.cartId, cart.id),
				eq(CartProduct.productId, productId)
			)
		});

		if (existingCartProduct) {
			// Update quantity
			await db
				.update(CartProduct)
				.set({ quantity: existingCartProduct.quantity + quantity })
				.where(
					and(
						eq(CartProduct.cartId, cart.id),
						eq(CartProduct.productId, existingCartProduct.productId)
					)
				);
		} else {
			// Add new product to cart
			await db.insert(CartProduct).values({
				userId: req.auth!.id,
				cartId: cart.id,
				productId,
				quantity
			});
		}

		const updatedCart = await db.query.Cart.findFirst({
			where: eq(Cart.id, cart.id),
			with: { products: { with: { product: true } } }
		});

		res.status(201).json({ data: updatedCart });
	}
);

// PUT /carts/current/products/:id
router.put(
	'/current/products/:id',
	authenticate,
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const { quantity } = req.body;

		if (!id) {
			throw new APIException(400, 'Product id is required');
		}

		const cart = await db.query.Cart.findFirst({
			where: and(
				eq(Cart.userId, req.auth!.id),
				eq(Cart.storeId, req.headers['x-market-store-id'] as string)
			)
		});

		if (!cart) {
			throw new APIException(404, 'Cart not found');
		}

		const cartProduct = await db.query.CartProduct.findFirst({
			where: and(eq(CartProduct.cartId, cart.id), eq(CartProduct.productId, id))
		});

		if (!cartProduct) {
			throw new APIException(404, 'Product not found in cart');
		}

		if (quantity <= 0) {
			await db
				.delete(CartProduct)
				.where(
					and(
						eq(CartProduct.cartId, cart.id),
						eq(CartProduct.productId, cartProduct.productId)
					)
				);
		} else {
			await db
				.update(CartProduct)
				.set({ quantity })
				.where(
					and(
						eq(CartProduct.cartId, cart.id),
						eq(CartProduct.productId, cartProduct.productId)
					)
				);
		}

		const updatedCart = await db.query.Cart.findFirst({
			where: eq(Cart.id, cart.id),
			with: { products: { with: { product: true } } }
		});

		res.json({ data: updatedCart });
	}
);

// DELETE /carts/current/products/:id
router.delete(
	'/current/products/:id',
	authenticate,
	async (req: Request, res: Response) => {
		const { id } = req.params;

		if (!id) {
			throw new APIException(400, 'Product id is required');
		}

		const cart = await db.query.Cart.findFirst({
			where: and(
				eq(Cart.userId, req.auth!.id),
				eq(Cart.storeId, req.headers['x-market-store-id'] as string)
			)
		});

		if (!cart) {
			throw new APIException(404, 'Cart not found');
		}

		await db
			.delete(CartProduct)
			.where(
				and(eq(CartProduct.cartId, cart.id), eq(CartProduct.productId, id))
			);

		const updatedCart = await db.query.Cart.findFirst({
			where: eq(Cart.id, cart.id),
			with: { products: { with: { product: true } } }
		});

		return res.json({ data: updatedCart });
	}
);

export default router;
