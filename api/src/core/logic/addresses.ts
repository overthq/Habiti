import type { Context } from 'hono';

import * as AddressData from '../data/addresses';
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

	return AddressData.createUserAddress(c.var.prisma, {
		...(args as StripUndefined<UserAddressArgs>),
		userId: c.var.auth.id
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

	const address = await AddressData.getAddressById(c.var.prisma, addressId);
	if (!address || address.userId !== c.var.auth.id) {
		throw new LogicError(LogicErrorCode.NotFound);
	}

	return AddressData.updateAddress(
		c.var.prisma,
		addressId,
		args as StripUndefined<typeof args>
	);
};

export const deleteUserAddress = async (
	c: Context<AppEnv>,
	addressId: string
) => {
	if (!c.var.auth?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	const address = await AddressData.getAddressById(c.var.prisma, addressId);
	if (!address || address.userId !== c.var.auth.id) {
		throw new LogicError(LogicErrorCode.NotFound);
	}

	await AddressData.deleteAddress(c.var.prisma, addressId);
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

	return AddressData.getStoreAddresses(c.var.prisma, storeId);
};

export const createStoreAddress = async (
	c: Context<AppEnv>,
	args: StoreAddressArgs
) => {
	const { storeId } = assertStoreScope(c);

	return AddressData.createStoreAddress(c.var.prisma, {
		...(args as StripUndefined<StoreAddressArgs>),
		storeId
	});
};

export const editStoreAddress = async (
	c: Context<AppEnv>,
	addressId: string,
	args: Partial<StoreAddressArgs>
) => {
	const { storeId } = assertStoreScope(c);

	const address = await AddressData.getAddressById(c.var.prisma, addressId);
	if (!address || address.storeId !== storeId) {
		throw new LogicError(LogicErrorCode.NotFound);
	}

	return AddressData.updateAddress(
		c.var.prisma,
		addressId,
		args as StripUndefined<typeof args>
	);
};

export const deleteStoreAddress = async (
	c: Context<AppEnv>,
	addressId: string
) => {
	const { storeId } = assertStoreScope(c);

	const address = await AddressData.getAddressById(c.var.prisma, addressId);
	if (!address || address.storeId !== storeId) {
		throw new LogicError(LogicErrorCode.NotFound);
	}

	await AddressData.deleteAddress(c.var.prisma, addressId);
};
