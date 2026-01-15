import { Cart, CartProduct, Product } from '../../generated/prisma/client';
import { LogicError, LogicErrorCode } from '../logic/errors';

export const validateCart = async (
	cart: Cart & { products: (CartProduct & { product: Product })[] },
	userId: string
) => {
	if (!cart) {
		throw new LogicError(LogicErrorCode.CartNotFound);
	}

	if (cart.products.length === 0) {
		throw new Error(LogicErrorCode.CartEmpty);
	}

	if (cart.userId !== null && cart.userId !== userId) {
		throw new LogicError(LogicErrorCode.Forbidden);
	}

	for (const cartProduct of cart.products) {
		const product = cartProduct.product;
		if (product.quantity < cartProduct.quantity) {
			throw new LogicError(LogicErrorCode.InsufficientStock);
		}
	}
};
