import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';

import type { AppEnv } from '../types/hono';
import { zodHook } from '../utils/validation';
import { authenticate, optionalAuth } from '../middleware/auth';
import * as CartLogic from '../core/logic/carts';
import * as Schemas from '../core/validations/rest';

const carts = new Hono<AppEnv>();

carts.get(
	'/',
	optionalAuth,
	zValidator('query', Schemas.getCartsQuerySchema, zodHook),
	async c => {
		const { cartIds } = c.req.valid('query');

		const carts = await CartLogic.getCartsFromList(c, cartIds);
		return c.json({ carts });
	}
);

carts.get('/:id', optionalAuth, async c => {
	const cartWithContext = await CartLogic.getCartById(c, c.req.param('id'));
	return c.json(cartWithContext);
});

carts.post(
	'/products',
	optionalAuth,
	zValidator('json', Schemas.addProductToCartBodySchema, zodHook),
	async c => {
		const body = c.req.valid('json');
		const cartProduct = await CartLogic.addProductToCart(c, body);
		return c.json({ cartProduct });
	}
);

carts.put(
	'/:id/products/:productId',
	authenticate,
	zValidator('json', Schemas.updateCartProductBodySchema, zodHook),
	async c => {
		const id = c.req.param('id');
		const productId = c.req.param('productId');
		const { quantity } = c.req.valid('json');

		const cartProduct = await CartLogic.updateCartProductQuantity(c, {
			cartId: id,
			productId,
			quantity
		});
		return c.json({ cartProduct });
	}
);

carts.delete('/:id/products/:productId', authenticate, async c => {
	const id = c.req.param('id');
	const productId = c.req.param('productId');

	const cartProduct = await CartLogic.removeProductFromCart(c, {
		cartId: id,
		productId
	});
	return c.json({ cartProduct });
});

export default carts;
