import { ProductsArgs, StringWhere } from '../../types/filters';
import { PaginationArgs } from '../../types/pagination';
import { Resolver } from '../../types/resolvers';
import { decodeCursor, paginateQuery } from '../../utils/pagination';
import { storeAuthorizedResolver } from '../permissions';
import { CAN_VIEW_UNLISTED_STORES } from '../../utils/allowlist';
import { OrderStatus } from '@prisma/client';

export interface StoreArgs {
	id: string;
}

const store: Resolver<StoreArgs> = (_, { id }, ctx) => {
	return ctx.prisma.store.findUnique({ where: { id } });
};

const currentStore = storeAuthorizedResolver((_, __, ctx) => {
	if (!ctx.storeId) throw new Error('Invalid storeId');

	return ctx.prisma.store.findUnique({ where: { id: ctx.storeId } });
});

export interface StoresArgs {
	filter?: {
		name?: StringWhere;
	};
}

const stores: Resolver<StoresArgs> = (_, { filter }, ctx) => {
	const canViewUnlisted = CAN_VIEW_UNLISTED_STORES.includes(ctx.user?.id || '');
	const where = {
		...filter,
		...(canViewUnlisted ? {} : { unlisted: false })
	};

	return ctx.prisma.store.findMany({ where });
};

const products: Resolver<ProductsArgs & PaginationArgs> = (
	parent,
	args,
	ctx
) => {
	const { filter, orderBy, ...paginationArgs } = args;

	return paginateQuery(
		paginationArgs,
		async (take, cursor) => {
			const query: any = { where: filter, orderBy, take };

			if (cursor) {
				query.cursor = { id: decodeCursor(cursor) };
				query.skip = 1;
			}

			const result = await ctx.prisma.store
				.findUnique({ where: { id: parent.id } })
				.products(query);

			return result ?? [];
		},
		() => ctx.prisma.product.count({ where: { ...filter, storeId: parent.id } })
	);
};

export interface OrdersArgs {
	status?: OrderStatus;
	orderBy: {
		createdAt?: 'asc' | 'desc';
		updatedAt?: 'asc' | 'desc';
	}[];
}

const orders: Resolver<OrdersArgs> = (parent, { orderBy, status }, ctx) => {
	return ctx.prisma.store.findUnique({ where: { id: parent.id } }).orders({
		orderBy,
		// FIXME: We should make this a filter on the client side.
		where: {
			...(status && ctx.storeId
				? { AND: [{ status }, { status: { not: OrderStatus.PaymentPending } }] }
				: status
					? { status }
					: ctx.storeId
						? { status: { not: OrderStatus.PaymentPending } }
						: {})
		}
	});
};

const managers: Resolver = (parent, _, ctx) => {
	return ctx.prisma.store
		.findUnique({ where: { id: parent.id } })
		.managers({ include: { manager: true } });
};

const followers: Resolver = (parent, _, ctx) => {
	return ctx.prisma.store
		.findUnique({ where: { id: parent.id } })
		.followers({ include: { follower: true } });
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

const userCart: Resolver = async (parent, _, ctx) => {
	const fetchedCart = await ctx.prisma.cart.findUnique({
		where: { userId_storeId: { userId: ctx.user.id, storeId: parent.id } },
		// FIXME: This is a little wasteful just to get the item count,
		// but I'm also not sure what the client requirements will become soon.
		include: { products: true }
	});

	return fetchedCart;
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
		userCart,
		categories
	}
};
