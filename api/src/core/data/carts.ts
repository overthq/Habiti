import { Prisma, PrismaClient } from '@prisma/client';

interface UpdateCartQuantityParams {
	cartId: string;
	productId: string;
	quantity: number;
}

// TODO: Make sure that if a regular user is accessing this,
// they must be the cart owner (or otherwise have provable access to it)
// Admins should be able to get the data without restriction.

export const getCartById = async (prisma: PrismaClient, cartId: string) => {
	const cart = await prisma.cart.findUnique({
		where: { id: cartId },
		include: {
			products: { include: { product: { include: { images: true } } } },
			store: { include: { image: true } },
			user: { include: { cards: true } }
		}
	});

	if (!cart) {
		throw new Error('Cart not found');
	}

	const cartTotal = cart.products.reduce((acc, p) => {
		return acc + p.product.unitPrice * p.quantity;
	}, 0);

	return { ...cart, total: cartTotal };
};

export const getCartsByUserId = async (
	prisma: PrismaClient,
	userId: string,
	query: Prisma.CartFindManyArgs
) => {
	const carts = await prisma.cart.findMany({
		where: { userId },
		include: {
			products: { include: { product: true } },
			store: true
		},
		...query
	});

	return carts;
};

interface AddProductToCartArgs {
	storeId: string;
	productId: string;
	userId: string;
	quantity: number;
}

export const addProductToCart = async (
	prisma: PrismaClient,
	args: AddProductToCartArgs
) => {
	const cart = await prisma.cart.upsert({
		where: { userId_storeId: { userId: args.userId, storeId: args.storeId } },
		update: {},
		create: { userId: args.userId, storeId: args.storeId }
	});

	const cartProduct = await prisma.cartProduct.upsert({
		where: { cartId_productId: { cartId: cart.id, productId: args.productId } },
		update: { quantity: args.quantity },
		create: {
			cartId: cart.id,
			productId: args.productId,
			quantity: args.quantity
		}
	});

	return cartProduct;
};

interface RemoveProductFromCartArgs {
	userId: string;
	cartId: string;
	productId: string;
}

export const removeProductFromCart = async (
	prisma: PrismaClient,
	args: RemoveProductFromCartArgs
) => {
	const cart = await prisma.cart.findUnique({
		where: { id: args.cartId, userId: args.userId }
	});

	if (!cart) {
		throw new Error('Cart not found');
	}

	const cartProduct = await prisma.cartProduct.delete({
		where: {
			cartId_productId: { cartId: args.cartId, productId: args.productId }
		}
	});

	return cartProduct;
};

export const updateCartProductQuantity = async (
	prisma: PrismaClient,
	params: UpdateCartQuantityParams
) => {
	const { cartId, productId, quantity } = params;

	if (quantity <= 0) {
		return prisma.cartProduct.delete({
			where: { cartId_productId: { cartId, productId } },
			include: { cart: true, product: true }
		});
	} else {
		return prisma.cartProduct.upsert({
			where: { cartId_productId: { cartId, productId } },
			update: { quantity },
			create: { cartId, productId, quantity },
			include: { cart: true, product: true }
		});
	}
};

interface DeleteCartArgs {
	userId: string;
	cartId: string;
}

export const deleteCart = async (
	prisma: PrismaClient,
	args: DeleteCartArgs
) => {
	const cart = await prisma.cart.findUnique({ where: { id: args.cartId } });

	if (!cart) {
		throw new Error('Specified cart does not exist');
	}

	if (cart?.userId !== args.userId) {
		throw new Error('User unauthorized to delete this cart');
	}

	await prisma.cart.delete({ where: { id: args.cartId } });
};
