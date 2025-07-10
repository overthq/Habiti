import { Request, Response } from 'express';

import prismaClient from '../config/prisma';

export const getCartById = async (req: Request, res: Response) => {
	if (!req.auth) {
		return res.status(401).json({ error: 'User not authenticated' });
	}

	if (!req.params.id) {
		return res.status(400).json({ error: 'Cart ID is required' });
	}

	const cart = await prismaClient.cart.findUnique({
		where: { id: req.params.id, userId: req.auth.id },
		include: {
			user: { include: { cards: true } },
			store: { include: { image: true } },
			products: { include: { product: { include: { images: true } } } }
		}
	});

	if (!cart) {
		return res.status(404).json({ error: 'Cart not found' });
	}

	const computedTotal = cart.products.reduce((acc, p) => {
		return acc + p.product.unitPrice * p.quantity;
	}, 0);

	return res.json({ cart: { ...cart, total: computedTotal } });
};

export const addProductToCart = async (req: Request, res: Response) => {
	const { productId, quantity } = req.body;

	if (!req.auth) {
		return res.status(401).json({ error: 'User not authenticated' });
	}

	const userId = req.auth.id;
	const storeId = req.headers['x-market-store-id'] as string;

	const cart = await prismaClient.cart.findUnique({
		where: { userId_storeId: { userId, storeId } }
	});

	if (!cart) {
		return res.status(404).json({ error: 'Cart not found' });
	}

	const product = await prismaClient.product.findUnique({
		where: { id: productId }
	});

	if (!product) {
		return res.status(404).json({ error: 'Product not found' });
	}

	const cartProduct = await prismaClient.cartProduct.create({
		data: { cartId: cart.id, productId, quantity }
	});

	return res.json({ cartProduct });
};

export const removeProductFromCart = async (req: Request, res: Response) => {
	const { id, productId } = req.params;

	if (!id || !productId) {
		return res
			.status(400)
			.json({ error: 'Cart ID and product ID are required' });
	}

	if (!req.auth) {
		return res.status(401).json({ error: 'User not authenticated' });
	}

	const cart = await prismaClient.cart.findUnique({
		where: { id, userId: req.auth.id }
	});

	if (!cart) {
		return res.status(404).json({ error: 'Cart not found' });
	}

	const cartProduct = await prismaClient.cartProduct.delete({
		where: { cartId_productId: { cartId: id, productId } }
	});

	return res.json({ cartProduct });
};
