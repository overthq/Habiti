import type { Context } from 'hono';

import { Prisma } from '../../generated/prisma/client';
import type { StripUndefined } from '../../utils/objects';

import * as UserData from '../data/users';
import * as StoreData from '../data/stores';
import * as OrderData from '../data/orders';
import * as CartData from '../data/carts';
import * as CardData from '../data/cards';
import * as AddressData from '../data/addresses';

import { cacheVerificationCode } from './auth';
import { denySession } from '../data/sessionRevocation';
import { registerBodySchema } from '../validations/rest';
import { env } from '../../config/env';
import type { AppleIdentity } from './apple';

import { EmailType } from '../../services/email';

import type { AppEnv } from '../../types/hono';
import type { CreateUserParams } from '../data/users';
import { LogicError, LogicErrorCode } from './errors';
import { UserFilters } from '../../utils/queries';

export const register = async (c: Context<AppEnv>, args: unknown) => {
	const { data, error } = registerBodySchema.safeParse(args);

	if (error) {
		throw new LogicError(
			LogicErrorCode.ValidationFailed,
			`Malformed input: ${error.message}`
		);
	}

	const existingUser = await UserData.getUserByEmail(c.var.prisma, data.email);

	if (existingUser) {
		throw new LogicError(
			LogicErrorCode.InvalidInput,
			'A user already exists with the specified email'
		);
	}

	const user = await UserData.createUser(c.var.prisma, {
		name: data.name,
		email: data.email
	});

	const code = await cacheVerificationCode(c, data.email);

	const isTestAccount =
		env.TEST_ACCOUNT_EMAIL && data.email === env.TEST_ACCOUNT_EMAIL;

	if (!isTestAccount) {
		c.var.services.email.sendMail({
			emailType: EmailType.NewAccount,
			email: data.email,
			code
		});
	}

	return user;
};

interface LoginInput {
	email: string;
}

export const login = async (c: Context<AppEnv>, input: LoginInput) => {
	const user = await UserData.getUserByEmail(c.var.prisma, input.email);

	if (!user) {
		throw new LogicError(
			LogicErrorCode.UserNotFound,
			'No user exists with the specified email'
		);
	}

	const code = await cacheVerificationCode(c, input.email);

	const isTestAccount =
		env.TEST_ACCOUNT_EMAIL && input.email === env.TEST_ACCOUNT_EMAIL;

	if (!isTestAccount) {
		c.var.services.email.sendMail({
			emailType: EmailType.NewAccount,
			email: input.email,
			code
		});
	}

	return user;
};

export const getUsers = (c: Context<AppEnv>, filters?: UserFilters) => {
	return UserData.getUsers(c.var.prisma, filters);
};

export const getCurrentUser = (c: Context<AppEnv>) => {
	if (!c.var.auth) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}
	return UserData.getUserById(c.var.prisma, c.var.auth.id);
};

interface UpdateUserInput {
	userId: string;
	name?: string | undefined;
	email?: string | undefined;
}

export const updateUser = async (
	c: Context<AppEnv>,
	input: UpdateUserInput
) => {
	const { userId, ...rest } = input;

	if (!c.var.auth?.id || (userId !== c.var.auth.id && !c.var.isAdmin)) {
		throw new LogicError(LogicErrorCode.Forbidden);
	}

	return UserData.updateUser(
		c.var.prisma,
		userId,
		rest as StripUndefined<typeof rest>
	);
};

export const updateCurrentUser = (
	c: Context<AppEnv>,
	input: Omit<UpdateUserInput, 'userId'>
) => {
	if (!c.var.auth?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	return updateUser(c, { ...input, userId: c.var.auth.id });
};

export const deleteCurrentUser = (c: Context<AppEnv>) => {
	if (!c.var.auth?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	return deleteUser(c, { userId: c.var.auth.id });
};

interface DeleteUserInput {
	userId: string;
}

export const deleteUser = async (
	c: Context<AppEnv>,
	input: DeleteUserInput
) => {
	const { userId } = input;

	if (!c.var.auth?.id || (userId !== c.var.auth.id && !c.var.isAdmin)) {
		throw new LogicError(LogicErrorCode.Forbidden);
	}

	return UserData.deleteUser(c.var.prisma, userId);
};

export const getFollowedStores = (c: Context<AppEnv>) => {
	if (!c.var.auth?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	return StoreData.getFollowedStores(c.var.prisma, c.var.auth.id);
};

export const getManagedStores = (c: Context<AppEnv>) => {
	if (!c.var.auth?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	return UserData.getManagedStores(c.var.prisma, c.var.auth.id);
};

export const getUserById = (c: Context<AppEnv>, userId: string) => {
	return UserData.getUserById(c.var.prisma, userId);
};

export const getOrders = (
	c: Context<AppEnv>,
	query: Prisma.OrderFindManyArgs
) => {
	if (!c.var.auth?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	return OrderData.getOrdersByUserId(c.var.prisma, c.var.auth.id, query);
};

export const getCarts = (
	c: Context<AppEnv>,
	query: Prisma.CartFindManyArgs
) => {
	if (!c.var.auth?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	return CartData.getCartsByUserId(c.var.prisma, c.var.auth.id, query);
};

export const getCards = (c: Context<AppEnv>) => {
	if (!c.var.auth?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	return CardData.getCardsByUserId(c.var.prisma, c.var.auth.id);
};

export const getDeliveryAddresses = (c: Context<AppEnv>) => {
	if (!c.var.auth?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	return AddressData.getUserAddresses(c.var.prisma, c.var.auth.id);
};

export const getUserByEmail = (c: Context<AppEnv>, email: string) => {
	return UserData.getUserByEmail(c.var.prisma, email);
};

export const createUser = (c: Context<AppEnv>, input: CreateUserParams) => {
	return UserData.createUser(c.var.prisma, input);
};

export const createAnonymousUser = (c: Context<AppEnv>) => {
	return UserData.createUser(c.var.prisma, {
		name: 'Guest',
		isAnonymous: true
	});
};

export const mergeAnonymousUser = async (
	c: Context<AppEnv>,
	anonymousUserId: string,
	targetUserId: string
) => {
	const { sessionIds } = await UserData.mergeUsers(
		c.var.prisma,
		anonymousUserId,
		targetUserId
	);

	for (const sessionId of sessionIds) {
		await denySession(c.var.redis, sessionId);
	}

	c.var.services.analytics.track({
		event: 'anonymous_user_merged',
		distinctId: targetUserId,
		properties: { anonymousUserId }
	});
};

export const getAnonymousCaller = async (c: Context<AppEnv>) => {
	if (!c.var.auth?.id || c.var.isAdmin) {
		return null;
	}

	const caller = await UserData.getUserById(c.var.prisma, c.var.auth.id);
	return caller?.isAnonymous ? caller : null;
};

interface SignInWithAppleInput {
	identity: AppleIdentity;
	name?: string | undefined;
}

/**
 * Resolve an Apple identity to a Habiti user:
 * 1. by `appleId` (the stable identifier),
 * 2. by verified email — linking `appleId` onto the existing account,
 * 3. by promoting the caller's anonymous user in place,
 * 4. by creating a fresh user.
 *
 * When the caller is anonymous and the identity resolves to a different
 * existing account, the anonymous user's data is merged into it.
 */
export const signInWithApple = async (
	c: Context<AppEnv>,
	input: SignInWithAppleInput
) => {
	const { identity, name } = input;

	const anonymousCaller = await getAnonymousCaller(c);

	let user = await UserData.getUserByAppleId(c.var.prisma, identity.appleId);

	// Only link by email when Apple attests the address is verified —
	// otherwise an attacker-controlled Apple ID with someone else's email
	// could take over their account.
	if (!user && identity.email && identity.emailVerified) {
		const byEmail = await UserData.getUserByEmail(c.var.prisma, identity.email);

		if (byEmail) {
			if (byEmail.appleId && byEmail.appleId !== identity.appleId) {
				throw new LogicError(
					LogicErrorCode.InvalidCredentials,
					'This email is already linked to a different Apple ID'
				);
			}

			user = await UserData.updateUser(c.var.prisma, byEmail.id, {
				appleId: identity.appleId
			});
		}
	}

	if (user) {
		if (anonymousCaller && anonymousCaller.id !== user.id) {
			await mergeAnonymousUser(c, anonymousCaller.id, user.id);
		}

		return user;
	}

	const email = identity.emailVerified ? identity.email : null;
	const resolvedName = name?.trim() || '';

	if (anonymousCaller) {
		return UserData.updateUser(c.var.prisma, anonymousCaller.id, {
			appleId: identity.appleId,
			...(email ? { email } : {}),
			...(resolvedName ? { name: resolvedName } : {}),
			isAnonymous: false
		});
	}

	return UserData.createUser(c.var.prisma, {
		name: resolvedName,
		email,
		appleId: identity.appleId
	});
};
