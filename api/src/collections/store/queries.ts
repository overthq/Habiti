import { Resolver } from '../../types/resolvers';

interface StoreArgs {
	id: string;
}

const store: Resolver<StoreArgs> = (_, { id }, ctx) => {
	return ctx.prisma.store.findUnique({ where: { id } });
};

const stores: Resolver = (_, __, ctx) => {
	return ctx.prisma.store.findMany();
};

const products: Resolver = (parent, _, ctx) => {
	return ctx.prisma.store.findUnique({ where: { id: parent.id } }).products();
};

const orders: Resolver = (parent, _, ctx) => {
	return ctx.prisma.store.findUnique({ where: { id: parent.id } }).orders();
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
		followedByUser,
		cartId
	}
};
