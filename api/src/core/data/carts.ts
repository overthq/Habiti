import { Cart, Prisma, PrismaClient } from '@prisma/client';

interface UpdateCartQuantityParams {
	cartId: string;
	productId: string;
	quantity: number;
}

// TODO: Make sure that if a regular user is accessing this,
// they must be the cart owner (or otherwise have provable access to it)
// Admins should be able to get the data without restriction.
// For unauthenticated (guest) users, consider linking their session
// to the cart, so we can validate that way.
// Something like:
// - ctx.user.id === cart.userId || cart.sessionId === ctx.sessionId
// In this case, ctx.sessionId would be derived from a cookie.

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

export const getCartViewerContext = async (
	prisma: PrismaClient,
	userId: string
) => {
	const cards = await prisma.card.findMany({
		where: { userId }
	});

	return { cards };
};

export const getCartsByUserId = async (
	prisma: PrismaClient,
	userId: string,
	query?: Prisma.CartFindManyArgs
) => {
	const carts = await prisma.cart.findMany({
		where: { userId },
		include: {
			products: { include: { product: { include: { images: true } } } },
			store: true
		},
		...query
	});

	return carts;
};

interface AddProductToCartArgs {
	storeId: string;
	productId: string;
	userId?: string;
	quantity: number;
	cartId?: string; // For updating existing guest carts
}

export const addProductToCart = async (
	prisma: PrismaClient,
	args: AddProductToCartArgs
) => {
	let cart: Cart | null;

	if (args.userId) {
		// Authenticated user: upsert by userId + storeId
		cart = await prisma.cart.upsert({
			where: { userId_storeId: { userId: args.userId, storeId: args.storeId } },
			update: {},
			create: { userId: args.userId, storeId: args.storeId }
		});
	} else if (args.cartId) {
		cart = await prisma.cart.findUnique({
			where: { id: args.cartId }
		});

		// FIXME: Return 404 when the cart does not exist.
		if (!cart || cart.storeId !== args.storeId) {
			cart = await prisma.cart.create({
				data: { storeId: args.storeId }
			});
		}
	} else {
		cart = await prisma.cart.create({
			data: { storeId: args.storeId }
		});
	}

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

interface ClaimCartsArgs {
	userId: string;
	cartIds: string[];
}

export const claimCarts = async (
	prisma: PrismaClient,
	args: ClaimCartsArgs
) => {
	const { userId, cartIds } = args;
	const claimedCarts: string[] = [];

	for (const cartId of cartIds) {
		const guestCart = await prisma.cart.findUnique({
			where: { id: cartId },
			include: { products: true }
		});

		// Skip if cart doesn't exist or already has an owner
		if (!guestCart || guestCart.userId !== null) {
			continue;
		}

		// Check if user already has a cart for this store
		const existingUserCart = await prisma.cart.findUnique({
			where: { userId_storeId: { userId, storeId: guestCart.storeId } }
		});

		if (existingUserCart) {
			// Merge: move products from guest cart to existing user cart
			for (const product of guestCart.products) {
				await prisma.cartProduct.upsert({
					where: {
						cartId_productId: {
							cartId: existingUserCart.id,
							productId: product.productId
						}
					},
					update: { quantity: product.quantity },
					create: {
						cartId: existingUserCart.id,
						productId: product.productId,
						quantity: product.quantity
					}
				});
			}

			// Delete the guest cart (products will be cascade deleted)
			await prisma.cart.delete({ where: { id: cartId } });
			claimedCarts.push(existingUserCart.id);
		} else {
			// Transfer ownership: assign userId to guest cart
			await prisma.cart.update({
				where: { id: cartId },
				data: { userId }
			});
			claimedCarts.push(cartId);
		}
	}

	return claimedCarts;
};

export const calculatePaystackFee = (subTotal: number) => {
	return Math.min(200000, 0.015 * subTotal + 10000);
};

export const calculateHabitiFee = () => 100000;
