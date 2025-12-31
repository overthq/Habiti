import { Prisma } from '../../generated/prisma/client';

import * as UserData from '../data/users';
import * as StoreData from '../data/stores';
import * as OrderData from '../data/orders';
import * as CartData from '../data/carts';
import * as CardData from '../data/cards';
import * as AddressData from '../data/addresses';

import { cacheVerificationCode } from './auth';
import { registerBodySchema } from '../validations/auth';

import { EmailType } from '../../services/email';

import type { AppContext } from '../../utils/context';
import type { CreateUserParams } from '../data/users';
import { LogicError, LogicErrorCode } from './errors';

export const register = async (ctx: AppContext, args: unknown) => {
	const { data, error } = registerBodySchema.safeParse(args);

	if (error) {
		throw new LogicError(
			LogicErrorCode.ValidationFailed,
			`Malformed input: ${error.message}`
		);
	}

	const existingUser = await UserData.getUserByEmail(ctx.prisma, data.email);

	if (existingUser) {
		throw new LogicError(
			LogicErrorCode.InvalidInput,
			'A user already exists with the specified email'
		);
	}

	const user = await UserData.createUser(ctx.prisma, {
		name: data.name,
		email: data.email
	});

	const code = await cacheVerificationCode(data.email);

	ctx.services.email.sendMail({
		emailType: EmailType.NewAccount,
		email: data.email,
		code
	});

	return user;
};

interface LoginInput {
	email: string;
}

export const login = async (ctx: AppContext, input: LoginInput) => {
	const user = await UserData.getUserByEmail(ctx.prisma, input.email);

	if (!user) {
		throw new LogicError(
			LogicErrorCode.UserNotFound,
			'No user exists with the specified email'
		);
	}

	const code = await cacheVerificationCode(input.email);

	ctx.services.email.sendMail({
		emailType: EmailType.NewAccount,
		email: input.email,
		code
	});

	return user;
};

export const getUsers = (ctx: AppContext, query: Prisma.UserFindManyArgs) => {
	return UserData.getUsers(ctx.prisma, query);
};

export const getCurrentUser = (ctx: AppContext) => {
	if (!ctx.user) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
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

	if (!ctx.user?.id || (userId !== ctx.user.id && !userIsAdmin)) {
		throw new LogicError(LogicErrorCode.Forbidden);
	}

	return UserData.updateUser(ctx.prisma, userId, rest);
};

export const updateCurrentUser = (
	ctx: AppContext,
	input: Omit<UpdateUserInput, 'userId'>
) => {
	if (!ctx.user?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	return updateUser(ctx, { ...input, userId: ctx.user.id });
};

export const deleteCurrentUser = (ctx: AppContext) => {
	if (!ctx.user?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	return deleteUser(ctx, { userId: ctx.user.id });
};

interface DeleteUserInput {
	userId: string;
}

export const deleteUser = async (ctx: AppContext, input: DeleteUserInput) => {
	const { userId } = input;

	const userIsAdmin = await ctx.isAdmin();

	if (!ctx.user?.id || (userId !== ctx.user.id && !userIsAdmin)) {
		throw new LogicError(LogicErrorCode.Forbidden);
	}

	return UserData.deleteUser(ctx.prisma, userId);
};

export const getFollowedStores = (ctx: AppContext) => {
	if (!ctx.user?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	return StoreData.getFollowedStores(ctx.prisma, ctx.user.id);
};

export const getManagedStores = (ctx: AppContext) => {
	if (!ctx.user?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	return UserData.getManagedStores(ctx.prisma, ctx.user.id);
};

export const getUserById = (ctx: AppContext, userId: string) => {
	return UserData.getUserById(ctx.prisma, userId);
};

export const getOrders = (ctx: AppContext, query: Prisma.OrderFindManyArgs) => {
	if (!ctx.user?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	return OrderData.getOrdersByUserId(ctx.prisma, ctx.user.id, query);
};

export const getCarts = (ctx: AppContext, query: Prisma.CartFindManyArgs) => {
	if (!ctx.user?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	return CartData.getCartsByUserId(ctx.prisma, ctx.user.id, query);
};

export const getCards = (ctx: AppContext) => {
	if (!ctx.user?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	return CardData.getCardsByUserId(ctx.prisma, ctx.user.id);
};

export const getDeliveryAddresses = (ctx: AppContext) => {
	if (!ctx.user?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	return AddressData.getDeliveryAddressesByUserId(ctx.prisma, ctx.user.id);
};

export const getUserByEmail = (ctx: AppContext, email: string) => {
	return UserData.getUserByEmail(ctx.prisma, email);
};

export const createUser = (ctx: AppContext, input: CreateUserParams) => {
	return UserData.createUser(ctx.prisma, input);
};
