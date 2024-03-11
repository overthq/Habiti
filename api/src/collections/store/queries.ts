import { Resolver } from '../../types/resolvers';

interface StoreArgs {
	id: string;
}

const store: Resolver<StoreArgs> = (_, { id }, ctx) => {
	return ctx.prisma.store.findUnique({ where: { id } });
};

const currentStore: Resolver = (_, __, ctx) => {
	if (!ctx.storeId) throw new Error('Invalid storeId');

	return ctx.prisma.store.findUnique({ where: { id: ctx.storeId } });
};

const stores: Resolver = (_, __, ctx) => {
	return ctx.prisma.store.findMany();
};

type StringWhere = {
	contains?: string;
	search?: string;
	startsWith?: string;
	endsWith?: string;
	mode?: 'insensitive' | 'default';
};

type IntWhere = Partial<Record<'lt' | 'lte' | 'gt' | 'gte', number>>;

interface ProductsArgs {
	filter?: {
		name?: StringWhere;
		unitPrice?: IntWhere;
		quantity?: IntWhere;
	};
	orderBy?: {
		createdAt?: 'asc' | 'desc';
		updatedAt?: 'asc' | 'desc';
		unitPrice?: 'asc' | 'desc';
	}[];
}

const products: Resolver<ProductsArgs> = (parent, { filter, orderBy }, ctx) => {
	return ctx.prisma.store
		.findUnique({ where: { id: parent.id } })
		.products({ where: filter, orderBy });
};

interface OrdersArgs {
	orderBy?: {
		createdAt?: 'asc' | 'desc';
		updatedAt?: 'asc' | 'desc';
	}[];
}

const orders: Resolver<OrdersArgs> = (parent, { orderBy }, ctx) => {
	return ctx.prisma.store
		.findUnique({ where: { id: parent.id } })
		.orders({ orderBy });
};

const managers: Resolver = (parent, _, ctx) => {
	return ctx.prisma.store.findUnique({ where: { id: parent.id } }).managers();
};

const followers: Resolver = (parent, _, ctx) => {
	return ctx.prisma.store.findUnique({ where: { id: parent.id } }).followers();
};

const carts: Resolver = (parent, _, ctx) => {
	return ctx.prisma.store.findUnique({ where: { id: parent.id } }).carts();
};

const image: Resolver = (parent, _, ctx) => {
	return ctx.prisma.store.findUnique({ where: { id: parent.id } }).image();
};

const payouts: Resolver = (parent, _, ctx) => {
	return ctx.prisma.store.findUnique({ where: { id: parent.id } }).payouts();
};

const categories: Resolver = (parent, _, ctx) => {
	return ctx.prisma.store.findUnique({ where: { id: parent.id } }).categories();
};

const followedByUser: Resolver = async (parent, _, ctx) => {
	const fetchedFollower = await ctx.prisma.storeFollower.findUnique({
		where: {
			storeId_followerId: { storeId: parent.id, followerId: ctx.user.id }
		}
	});

	return !!fetchedFollower;
};

const cartId: Resolver = async (parent, _, ctx) => {
	const { id } = await ctx.prisma.cart.findUnique({
		where: { userId_storeId: { userId: ctx.user.id, storeId: parent.id } },
		select: { id: true }
	});

	return id;
};

export default {
	Query: {
		currentStore,
		store,
		stores
	},
	Store: {
		products,
		orders,
		managers,
		followers,
		carts,
		image,
		payouts,
		followedByUser,
		cartId,
		categories
	}
};
