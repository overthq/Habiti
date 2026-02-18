import * as AddressData from '../data/addresses';
import { AppContext } from '../../utils/context';
import { LogicError, LogicErrorCode } from './errors';
import { canManageStore } from './permissions';

interface CreateUserAddressArgs {
	userId: string;
	name: string;
	line1: string;
	line2?: string;
	city: string;
	state: string;
	country: string;
	postcode?: string;
	latitude?: number;
	longitude?: number;
}

export const createUserAddress = async (
	ctx: AppContext,
	args: CreateUserAddressArgs
) => {
	if (!ctx.user?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	if (args.userId !== ctx.user.id) {
		throw new LogicError(LogicErrorCode.Forbidden);
	}

	return AddressData.createUserAddress(ctx.prisma, args);
};

// Store address logic

interface StoreAddressArgs {
	name: string;
	line1: string;
	line2?: string;
	city: string;
	state: string;
	country: string;
	postcode?: string;
	latitude?: number;
	longitude?: number;
}

export const getStoreAddresses = async (ctx: AppContext) => {
	if (!ctx.user?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	if (!ctx.storeId) {
		throw new LogicError(LogicErrorCode.StoreContextRequired);
	}

	const isAuthorized = await canManageStore(ctx);
	if (!isAuthorized) {
		throw new LogicError(LogicErrorCode.CannotManageStore);
	}

	return AddressData.getStoreAddresses(ctx.prisma, ctx.storeId);
};

export const createStoreAddress = async (
	ctx: AppContext,
	args: StoreAddressArgs
) => {
	if (!ctx.user?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	if (!ctx.storeId) {
		throw new LogicError(LogicErrorCode.StoreContextRequired);
	}

	const isAuthorized = await canManageStore(ctx);
	if (!isAuthorized) {
		throw new LogicError(LogicErrorCode.CannotManageStore);
	}

	return AddressData.createStoreAddress(ctx.prisma, {
		...args,
		storeId: ctx.storeId
	});
};

export const editStoreAddress = async (
	ctx: AppContext,
	addressId: string,
	args: Partial<StoreAddressArgs>
) => {
	if (!ctx.user?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	if (!ctx.storeId) {
		throw new LogicError(LogicErrorCode.StoreContextRequired);
	}

	const isAuthorized = await canManageStore(ctx);
	if (!isAuthorized) {
		throw new LogicError(LogicErrorCode.CannotManageStore);
	}

	const address = await AddressData.getAddressById(ctx.prisma, addressId);
	if (!address || address.storeId !== ctx.storeId) {
		throw new LogicError(LogicErrorCode.NotFound);
	}

	return AddressData.updateAddress(ctx.prisma, addressId, args);
};

export const deleteStoreAddress = async (
	ctx: AppContext,
	addressId: string
) => {
	if (!ctx.user?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	if (!ctx.storeId) {
		throw new LogicError(LogicErrorCode.StoreContextRequired);
	}

	const isAuthorized = await canManageStore(ctx);
	if (!isAuthorized) {
		throw new LogicError(LogicErrorCode.CannotManageStore);
	}

	const address = await AddressData.getAddressById(ctx.prisma, addressId);
	if (!address || address.storeId !== ctx.storeId) {
		throw new LogicError(LogicErrorCode.NotFound);
	}

	await AddressData.deleteAddress(ctx.prisma, addressId);
};
