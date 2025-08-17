import { PrismaClient } from '@prisma/client';

interface CreateCartParams {
	userId: string;
	storeId: string;
}

interface UpdateCartQuantityParams {
	cartId: string;
	productId: string;
	quantity: number;
}

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

	return cart;
};

export const deleteCart = async (prisma: PrismaClient, cartId: string) => {
	await prisma.cart.delete({ where: { id: cartId } });
};

export const getCartsByUserId = async (
	prisma: PrismaClient,
	userId: string
) => {
	const carts = await prisma.cart.findMany({
		where: { userId },
		include: {
			products: { include: { product: true } },
			store: true
		}
	});

	return carts;
};

export const createCart = async (
	prisma: PrismaClient,
	params: CreateCartParams
) => {
	const cart = await prisma.cart.create({
		data: params
	});

	return cart;
};

interface AddProductToCartArgs {
	cartId: string;
	storeId: string;
	productId: string;
	userId: string;
	quantity: number;
}

export const addProductToCart = async (
	prisma: PrismaClient,
	args: AddProductToCartArgs
) => {
	await prisma.cart.upsert({
		where: { id: args.cartId },
		update: {
			products: {
				create: { productId: args.productId, quantity: args.quantity }
			}
		},
		create: {
			userId: args.userId,
			storeId: args.storeId,
			products: {
				create: { productId: args.productId, quantity: args.quantity }
			}
		}
	});
};

export const updateCartProductQuantity = async (
	prisma: PrismaClient,
	params: UpdateCartQuantityParams
) => {
	const { cartId, productId, quantity } = params;

	if (quantity <= 0) {
		await prisma.cartProduct.delete({
			where: { cartId_productId: { cartId, productId } }
		});
	} else {
		await prisma.cartProduct.upsert({
			where: { cartId_productId: { cartId, productId } },
			update: { quantity },
			create: { cartId, productId, quantity }
		});
	}
};

export const removeProductFromCart = async (
	prisma: PrismaClient,
	cartId: string,
	productId: string
) => {
	await prisma.cartProduct.delete({
		where: { cartId_productId: { cartId, productId } }
	});
};

export const clearCart = async (prisma: PrismaClient, cartId: string) => {
	await prisma.cart.delete({ where: { id: cartId } });
};
