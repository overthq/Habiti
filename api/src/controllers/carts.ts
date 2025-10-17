import { Request, Response } from 'express';

import * as CartLogic from '../core/logic/carts';
import { getAppContext } from '../utils/context';

export const getCartById = async (req: Request, res: Response) => {
	if (!req.params.id) {
		return res.status(400).json({ error: 'Cart ID is required' });
	}

	const ctx = getAppContext(req);

	const cart = await CartLogic.getCartById(ctx, req.params.id);

	if (!cart) {
		return res.status(404).json({ error: 'Cart not found' });
	}

	return res.json({ cart });
};

export const addProductToCart = async (req: Request, res: Response) => {
	const { storeId, productId, quantity } = req.body;

	const ctx = getAppContext(req);

	const cartProduct = await CartLogic.addProductToCart(ctx, {
		storeId,
		productId,
		quantity
	});

	return res.json({ cartProduct });
};

export const updateCartProductQuantity = async (
	req: Request,
	res: Response
) => {
	const { id, productId } = req.params;
	const { quantity } = req.body;

	if (!id || !productId) {
		return res
			.status(400)
			.json({ error: 'Cart ID and product ID are required' });
	}

	const ctx = getAppContext(req);

	const cartProduct = await CartLogic.updateCartProductQuantity(ctx, {
		cartId: id,
		productId,
		quantity
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

	const ctx = getAppContext(req);

	const cartProduct = await CartLogic.removeProductFromCart(ctx, {
		cartId: id,
		productId
	});

	return res.json({ cartProduct });
};
