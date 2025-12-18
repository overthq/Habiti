import { Request, Response, NextFunction } from 'express';

import * as CartLogic from '../core/logic/carts';
import { getAppContext } from '../utils/context';
import { logicErrorToApiException } from '../core/logic/errors';

export const getCartById = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (!req.params.id) {
		return res.status(400).json({ error: 'Cart ID is required' });
	}

	const ctx = getAppContext(req);

	const cartWithContextResult = await CartLogic.getCartById(ctx, req.params.id);

	if (!cartWithContextResult.ok) {
		return next(logicErrorToApiException(cartWithContextResult.error));
	}

	return res.json(cartWithContextResult.data);
};

export const getCartsFromList = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { cartIds } = req.query;

	if (!cartIds || !Array.isArray(cartIds)) {
		return res.status(400).json({ error: 'Cart IDs must be provided' });
	}

	const ctx = getAppContext(req);

	const cartsResult = await CartLogic.getCartsFromList(
		ctx,
		cartIds as string[]
	);

	if (!cartsResult.ok) {
		return next(logicErrorToApiException(cartsResult.error));
	}

	return res.json({ carts: cartsResult.data });
};

export const addProductToCart = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { storeId, productId, quantity, cartId } = req.body;

	const ctx = getAppContext(req);

	const cartProductResult = await CartLogic.addProductToCart(ctx, {
		storeId,
		productId,
		quantity,
		cartId
	});

	if (!cartProductResult.ok) {
		return next(logicErrorToApiException(cartProductResult.error));
	}

	return res.json({ cartProduct: cartProductResult.data });
};

export const updateCartProductQuantity = async (
	req: Request,
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

	const ctx = getAppContext(req);

	const cartProductResult = await CartLogic.updateCartProductQuantity(ctx, {
		cartId: id,
		productId,
		quantity
	});

	if (!cartProductResult.ok) {
		return next(logicErrorToApiException(cartProductResult.error));
	}

	return res.json({ cartProduct: cartProductResult.data });
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

	const ctx = getAppContext(req);

	const cartProductResult = await CartLogic.removeProductFromCart(ctx, {
		cartId: id,
		productId
	});

	if (!cartProductResult.ok) {
		return next(logicErrorToApiException(cartProductResult.error));
	}

	return res.json({ cartProduct: cartProductResult.data });
};
