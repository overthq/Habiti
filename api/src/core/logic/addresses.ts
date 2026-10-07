import type { Context } from 'hono';

import type { AppEnv } from '../../types/hono';
import type { StripUndefined } from '../../utils/objects';
import { LogicError, LogicErrorCode } from './errors';
import { assertStoreScope } from './permissions';

interface UserAddressArgs {
	name: string;
	line1: string;
	line2?: string | undefined;
	city: string;
	state: string;
	country: string;
	postcode?: string | undefined;
	latitude?: number | undefined;
	longitude?: number | undefined;
}

export const createUserAddress = async (
	c: Context<AppEnv>,
	args: UserAddressArgs
) => {
	if (!c.var.auth?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	return c.var.prisma.address.create({
		data: {
			...(args as StripUndefined<UserAddressArgs>),
			userId: c.var.auth.id
		}
	});
};

export const editUserAddress = async (
	c: Context<AppEnv>,
	addressId: string,
	args: Partial<UserAddressArgs>
) => {
	if (!c.var.auth?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	const address = await c.var.prisma.address.findUnique({
		where: { id: addressId }
	});

	if (!address || address.userId !== c.var.auth.id) {
		throw new LogicError(LogicErrorCode.NotFound);
	}

	return c.var.prisma.address.update({
		where: { id: addressId },
		data: args as StripUndefined<typeof args>
	});
};

export const deleteUserAddress = async (
	c: Context<AppEnv>,
	addressId: string
) => {
	if (!c.var.auth?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	const address = await c.var.prisma.address.findUnique({
		where: { id: addressId }
	});

	if (!address || address.userId !== c.var.auth.id) {
		throw new LogicError(LogicErrorCode.NotFound);
	}

	await c.var.prisma.address.delete({ where: { id: addressId } });
};

// Store address logic

interface StoreAddressArgs {
	name: string;
	line1: string;
	line2?: string | undefined;
	city: string;
	state: string;
	country: string;
	postcode?: string | undefined;
	latitude?: number | undefined;
	longitude?: number | undefined;
}

export const getStoreAddresses = async (c: Context<AppEnv>) => {
	const { storeId } = assertStoreScope(c);

	return c.var.prisma.address.findMany({
		where: { storeId },
		orderBy: { createdAt: 'desc' }
	});
};

export const createStoreAddress = async (
	c: Context<AppEnv>,
	args: StoreAddressArgs
) => {
	const { storeId } = assertStoreScope(c);

	return c.var.prisma.address.create({
		data: {
			...(args as StripUndefined<StoreAddressArgs>),
			storeId
		}
	});
};

export const editStoreAddress = async (
	c: Context<AppEnv>,
	addressId: string,
	args: Partial<StoreAddressArgs>
) => {
	const { storeId } = assertStoreScope(c);

	const address = await c.var.prisma.address.findUnique({
		where: { id: addressId }
	});

	if (!address || address.storeId !== storeId) {
		throw new LogicError(LogicErrorCode.NotFound);
	}

	return c.var.prisma.address.update({
		where: { id: addressId },
		data: args as StripUndefined<typeof args>
	});
};

export const deleteStoreAddress = async (
	c: Context<AppEnv>,
	addressId: string
) => {
	const { storeId } = assertStoreScope(c);

	const address = await c.var.prisma.address.findUnique({
		where: { id: addressId }
	});

	if (!address || address.storeId !== storeId) {
		throw new LogicError(LogicErrorCode.NotFound);
	}

	await c.var.prisma.address.delete({ where: { id: addressId } });
};
