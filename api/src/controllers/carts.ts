import { Request, Response, NextFunction } from 'express';

import * as CartLogic from '../core/logic/carts';
import { getAppContext } from '../utils/context';
import type {
	GetCartsQuery,
	AddProductToCartBody,
	UpdateCartProductBody
} from '../core/validations/rest';

export const getCartById = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (!req.params.id) {
		return res.status(400).json({ error: 'Cart ID is required' });
	}

	try {
		const ctx = getAppContext(req);
		const cartWithContext = await CartLogic.getCartById(ctx, req.params.id);
		return res.json(cartWithContext);
	} catch (error) {
		return next(error);
	}
};

export const getCartsFromList = async (
	req: Request<{}, {}, {}, GetCartsQuery>,
	res: Response,
	next: NextFunction
) => {
	const { cartIds } = req.query;

	try {
		const ctx = getAppContext(req);
		const carts = await CartLogic.getCartsFromList(ctx, cartIds);
		return res.json({ carts });
	} catch (error) {
		return next(error);
	}
};

export const addProductToCart = async (
	req: Request<{}, {}, AddProductToCartBody>,
	res: Response,
	next: NextFunction
) => {
	try {
		const ctx = getAppContext(req);
		const cartProduct = await CartLogic.addProductToCart(ctx, req.body);
		return res.json({ cartProduct });
	} catch (error) {
		return next(error);
	}
};

export const updateCartProductQuantity = async (
	req: Request<{ id: string; productId: string }, {}, UpdateCartProductBody>,
	res: Response,
	next: NextFunction
) => {
	const { id, productId } = req.params;
	const { quantity } = req.body;

	if (!id || !productId) {
		return res
			.status(400)
			.json({ error: 'Cart ID and product ID are required' });
	}

	try {
		const ctx = getAppContext(req);
		const cartProduct = await CartLogic.updateCartProductQuantity(ctx, {
			cartId: id,
			productId,
			quantity
		});
		return res.json({ cartProduct });
	} catch (error) {
		return next(error);
	}
};

export const removeProductFromCart = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { id, productId } = req.params;

	if (!id || !productId) {
		return res
			.status(400)
			.json({ error: 'Cart ID and product ID are required' });
	}

	try {
		const ctx = getAppContext(req);
		const cartProduct = await CartLogic.removeProductFromCart(ctx, {
			cartId: id,
			productId
		});
		return res.json({ cartProduct });
	} catch (error) {
		return next(error);
	}
};
