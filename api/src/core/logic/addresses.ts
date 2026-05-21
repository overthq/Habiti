import type { Context } from 'hono';

import * as AddressData from '../data/addresses';
import type { AppEnv } from '../../types/hono';
import type { StripUndefined } from '../../utils/objects';
import { LogicError, LogicErrorCode } from './errors';
import { canManageStore } from './permissions';

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
	if (!c.var.auth?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	if (!c.var.storeId) {
		throw new LogicError(LogicErrorCode.StoreContextRequired);
	}

	const isAuthorized = await canManageStore(c);
	if (!isAuthorized) {
		throw new LogicError(LogicErrorCode.CannotManageStore);
	}

	return AddressData.getStoreAddresses(c.var.prisma, c.var.storeId);
};

export const createStoreAddress = async (
	c: Context<AppEnv>,
	args: StoreAddressArgs
) => {
	if (!c.var.auth?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	if (!c.var.storeId) {
		throw new LogicError(LogicErrorCode.StoreContextRequired);
	}

	const isAuthorized = await canManageStore(c);
	if (!isAuthorized) {
		throw new LogicError(LogicErrorCode.CannotManageStore);
	}

	return AddressData.createStoreAddress(c.var.prisma, {
		...(args as StripUndefined<StoreAddressArgs>),
		storeId: c.var.storeId
	});
};

export const editStoreAddress = async (
	c: Context<AppEnv>,
	addressId: string,
	args: Partial<StoreAddressArgs>
) => {
	if (!c.var.auth?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	if (!c.var.storeId) {
		throw new LogicError(LogicErrorCode.StoreContextRequired);
	}

	const isAuthorized = await canManageStore(c);
	if (!isAuthorized) {
		throw new LogicError(LogicErrorCode.CannotManageStore);
	}

	const address = await AddressData.getAddressById(c.var.prisma, addressId);
	if (!address || address.storeId !== c.var.storeId) {
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
	if (!c.var.auth?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	if (!c.var.storeId) {
		throw new LogicError(LogicErrorCode.StoreContextRequired);
	}

	const isAuthorized = await canManageStore(c);
	if (!isAuthorized) {
		throw new LogicError(LogicErrorCode.CannotManageStore);
	}

	const address = await AddressData.getAddressById(c.var.prisma, addressId);
	if (!address || address.storeId !== c.var.storeId) {
		throw new LogicError(LogicErrorCode.NotFound);
	}

	await AddressData.deleteAddress(c.var.prisma, addressId);
};
