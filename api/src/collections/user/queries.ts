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

const pushTokens: Resolver = (parent, _, ctx) => {
	return ctx.prisma.user.findUnique({ where: { id: parent.id } }).pushTokens();
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
		cards,
		pushTokens
	}
};
