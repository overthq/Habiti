import { Resolver } from '../../types/resolvers';

const currentUser: Resolver = async (_, __, ctx) => {
	const fetchedCurrentUser = await ctx.prisma.user.findUnique({
		where: { id: ctx.user.id }
	});

	return fetchedCurrentUser;
};

const user: Resolver = async (_, { id }, ctx) => {
	const fetchedUser = await ctx.prisma.user.findUnique({ where: { id } });

	return fetchedUser;
};

const users: Resolver = async (_, __, ctx) => {
	const fetchedUsers = await ctx.prisma.user.findMany();

	return fetchedUsers;
};

const orders: Resolver = async (parent, _, ctx) => {
	const fetchedOrders = await ctx.prisma.user
		.findUnique({
			where: { id: parent.id }
		})
		.orders();

	return fetchedOrders;
};

const managed: Resolver = async (parent, _, ctx) => {
	const fetchedManaged = await ctx.prisma.user
		.findUnique({ where: { id: parent.id } })
		.managed();

	return fetchedManaged;
};

const followed: Resolver = async (parent, _, ctx) => {
	const fetchedFollowed = await ctx.prisma.user
		.findUnique({ where: { id: parent.id } })
		.followed();

	return fetchedFollowed;
};

const carts: Resolver = async (parent, _, ctx) => {
	const fetchedCarts = await ctx.prisma.user
		.findUnique({ where: { id: parent.id } })
		.carts();

	return fetchedCarts;
};

const watchlist: Resolver = async (parent, _, ctx) => {
	const fetchedWatchlist = await ctx.prisma.user
		.findUnique({ where: { id: parent.id } })
		.watchlist();

	return fetchedWatchlist;
};

export default {
	Query: {
		currentUser,
		user,
		users
	},
	User: {
		orders,
		managed,
		followed,
		carts,
		watchlist
	}
};
