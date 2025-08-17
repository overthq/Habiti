import { Request, Response } from 'express';

import prismaClient from '../config/prisma';
import * as CartData from '../core/data/carts';

export const getCartById = async (req: Request, res: Response) => {
	if (!req.auth) {
		return res.status(401).json({ error: 'User not authenticated' });
	}

	if (!req.params.id) {
		return res.status(400).json({ error: 'Cart ID is required' });
	}

	// TODO: Make sure that if a regular user is accessing this,
	// they must be the cart owner (or otherwise have provable access to it)
	// Admins should be able to get the data without restriction.
	const cart = await CartData.getCartById(prismaClient, req.params.id);

	if (!cart) {
		return res.status(404).json({ error: 'Cart not found' });
	}

	const computedTotal = cart.products.reduce((acc, p) => {
		return acc + p.product.unitPrice * p.quantity;
	}, 0);

	return res.json({ cart: { ...cart, total: computedTotal } });
};

export const addProductToCart = async (req: Request, res: Response) => {
	const { cartId, storeId, productId, quantity } = req.body;

	if (!req.auth) {
		return res.status(401).json({ error: 'User not authenticated' });
	}

	const userId = req.auth.id;

	const cartProduct = await CartData.addProductToCart(prismaClient, {
		cartId,
		storeId,
		productId,
		quantity,
		userId
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
