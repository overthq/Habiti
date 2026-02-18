import { PrismaClient } from '../../generated/prisma/client';

interface AddressFields {
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

interface CreateUserAddressParams extends AddressFields {
	userId: string;
}

export const createUserAddress = async (
	prisma: PrismaClient,
	params: CreateUserAddressParams
) => {
	return prisma.address.create({ data: params });
};

export const updateAddress = async (
	prisma: PrismaClient,
	addressId: string,
	params: Partial<AddressFields>
) => {
	return prisma.address.update({
		where: { id: addressId },
		data: params
	});
};

export const getAddressById = async (
	prisma: PrismaClient,
	addressId: string
) => {
	return prisma.address.findUnique({ where: { id: addressId } });
};

export const getUserAddresses = async (
	prisma: PrismaClient,
	userId: string
) => {
	return prisma.address.findMany({
		where: { userId },
		orderBy: { createdAt: 'desc' }
	});
};

export const deleteAddress = async (
	prisma: PrismaClient,
	addressId: string
) => {
	await prisma.address.delete({ where: { id: addressId } });
};

// Store address functions

interface CreateStoreAddressParams extends AddressFields {
	storeId: string;
}

export const createStoreAddress = async (
	prisma: PrismaClient,
	params: CreateStoreAddressParams
) => {
	return prisma.address.create({ data: params });
};

export const getStoreAddresses = async (
	prisma: PrismaClient,
	storeId: string
) => {
	return prisma.address.findMany({
		where: { storeId },
		orderBy: { createdAt: 'desc' }
	});
};
