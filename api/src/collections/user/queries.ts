import { Resolver } from '../../types/resolvers';

const currentUser: Resolver = (_, __, ctx) => {
	return ctx.prisma.user.findUnique({ where: { id: ctx.user.id } });
};

const user: Resolver = (_, { id }, ctx) => {
	return ctx.prisma.user.findUnique({ where: { id } });
};

const users: Resolver = (_, __, ctx) => {
	return ctx.prisma.user.findMany();
};

// Ideally, we should be able to pass a "first" arg to the orders query,
// and get the first x orders.
// By combining that with a desc date order, we should be able to get the three
// most recent orders.

const orders: Resolver = (parent, _, ctx) => {
	return ctx.prisma.user.findUnique({ where: { id: parent.id } }).orders();
};

const managed: Resolver = (parent, _, ctx) => {
	return ctx.prisma.user.findUnique({ where: { id: parent.id } }).managed();
};

const followed: Resolver = (parent, _, ctx) => {
	return ctx.prisma.user.findUnique({ where: { id: parent.id } }).followed();
};

const carts: Resolver = (parent, _, ctx) => {
	return ctx.prisma.user.findUnique({ where: { id: parent.id } }).carts();
};

const watchlist: Resolver = (parent, _, ctx) => {
	return ctx.prisma.user.findUnique({ where: { id: parent.id } }).watchlist();
};

const cards: Resolver = (parent, _, ctx) => {
	return ctx.prisma.user.findUnique({ where: { id: parent.id } }).cards();
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
		watchlist,
		cards
	}
};
