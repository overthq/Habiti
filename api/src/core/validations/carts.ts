import { Cart, CartProduct, Product } from '../../generated/prisma/client';

export const validateCart = async (
	cart: Cart & { products: (CartProduct & { product: Product })[] },
	userId: string
) => {
	if (!cart) {
		throw new Error('Cart not found');
	}

	if (cart.products.length === 0) {
		throw new Error('Cart is empty');
	}

	if (cart.userId !== userId) {
		throw new Error('Unauthorized: Cart does not belong to current user');
	}

	for (const cartProduct of cart.products) {
		const product = cartProduct.product;
		if (product.quantity < cartProduct.quantity) {
			throw new Error(`Insufficient stock for product: ${product.name}`);
		}
	}
};
