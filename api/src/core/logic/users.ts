import { Prisma } from '@prisma/client';

import * as UserData from '../data/users';
import * as StoreData from '../data/stores';
import * as OrderData from '../data/orders';
import * as CartData from '../data/carts';
import * as CardData from '../data/cards';
import * as AddressData from '../data/addresses';

import { cacheVerificationCode, hashPassword } from './auth';
import { registerBodySchema } from '../validations/auth';

import { EmailType } from '../../services/email';

import type { AppContext } from '../../utils/context';

export const register = async (ctx: AppContext, args: unknown) => {
	const { data, error } = registerBodySchema.safeParse(args);

	if (error) {
		throw new Error(`[UserLogic.register] - Malformed input: ${error.message}`);
	}

	const existingUser = await UserData.getUserByEmail(ctx.prisma, data.email);

	if (existingUser) {
		throw new Error('A user already exists with the specified email');
	}

	const passwordHash = await hashPassword(data.password);

	const user = await UserData.createUser(ctx.prisma, {
		name: data.name,
		email: data.email,
		passwordHash
	});

	const code = await cacheVerificationCode(data.email);

	ctx.services.email.sendMail({
		emailType: EmailType.NewAccount,
		email: data.email,
		code
	});

	return user;
};

export const getUsers = (ctx: AppContext, query: Prisma.UserFindManyArgs) => {
	return UserData.getUsers(ctx.prisma, query);
};

export const getCurrentUser = (ctx: AppContext) => {
	if (!ctx.user) {
		throw new Error(
			'[UserLogic.getCurrentUser] - an authenticated user is required to complete this action'
		);
	}
	return UserData.getUserById(ctx.prisma, ctx.user.id);
};

interface UpdateUserInput {
	userId: string;
	name?: string;
	email?: string;
}

export const updateUser = async (ctx: AppContext, input: UpdateUserInput) => {
	const { userId, ...rest } = input;

	const userIsAdmin = await ctx.isAdmin();

	if (userId !== ctx.user.id && !userIsAdmin) {
		throw new Error('Current user is not authorized to carry out this action');
	}

	return UserData.updateUser(ctx.prisma, userId, rest);
};

export const updateCurrentUser = (
	ctx: AppContext,
	input: Omit<UpdateUserInput, 'userId'>
) => {
	return updateUser(ctx, { ...input, userId: ctx.user.id });
};

export const deleteCurrentUser = (ctx: AppContext) => {
	return deleteUser(ctx, { userId: ctx.user.id });
};

interface DeleteUserInput {
	userId: string;
}

export const deleteUser = async (ctx: AppContext, input: DeleteUserInput) => {
	const { userId } = input;

	const userIsAdmin = await ctx.isAdmin();

	if (userId !== ctx.user.id && !userIsAdmin) {
		throw new Error('Current user is not authorized to carry out this action');
	}

	return UserData.deleteUser(ctx.prisma, userId);
};

export const getFollowedStores = (ctx: AppContext) => {
	return StoreData.getFollowedStores(ctx.prisma, ctx.user.id);
};

export const getManagedStores = (ctx: AppContext) => {
	return UserData.getManagedStores(ctx.prisma, ctx.user.id);
};

export const getUserById = (ctx: AppContext, userId: string) => {
	return UserData.getUserById(ctx.prisma, userId);
};

export const getOrders = (ctx: AppContext, query: Prisma.OrderFindManyArgs) => {
	return OrderData.getOrdersByUserId(ctx.prisma, ctx.user.id, query);
};

export const getCarts = (ctx: AppContext, query: Prisma.CartFindManyArgs) => {
	return CartData.getCartsByUserId(ctx.prisma, ctx.user.id, query);
};

export const getCards = (ctx: AppContext) => {
	return CardData.getCardsByUserId(ctx.prisma, ctx.user.id);
};

export const getDeliveryAddresses = (ctx: AppContext) => {
	return AddressData.getDeliveryAddressesByUserId(ctx.prisma, ctx.user.id);
};
