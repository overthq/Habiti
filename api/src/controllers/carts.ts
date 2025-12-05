import { Request, Response } from 'express';

import * as CartLogic from '../core/logic/carts';
import { getAppContext } from '../utils/context';

export const getCartById = async (req: Request, res: Response) => {
	if (!req.params.id) {
		return res.status(400).json({ error: 'Cart ID is required' });
	}

	const ctx = getAppContext(req);

	const cartWithContext = await CartLogic.getCartById(ctx, req.params.id);

	if (!cartWithContext) {
		return res.status(404).json({ error: 'Cart not found' });
	}

	return res.json(cartWithContext);
};

export const addProductToCart = async (req: Request, res: Response) => {
	const { storeId, productId, quantity, cartId } = req.body;

	const ctx = getAppContext(req);

	const cartProduct = await CartLogic.addProductToCart(ctx, {
		storeId,
		productId,
		quantity,
		cartId
	});

	return res.json({ cartProduct });
};

export const claimCarts = async (req: Request, res: Response) => {
	const { cartIds } = req.body;

	if (!Array.isArray(cartIds) || cartIds.length === 0) {
		return res.status(400).json({ error: 'cartIds array is required' });
	}

	const ctx = getAppContext(req);

	const claimedCarts = await CartLogic.claimCarts(ctx, { cartIds });

	return res.json({ claimedCarts });
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
