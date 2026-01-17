import { PrismaClient } from '../../generated/prisma/client';

interface CreateDeliveryAddressParams {
	userId: string;
	name: string;
}

export const createDeliveryAddress = async (
	prisma: PrismaClient,
	params: CreateDeliveryAddressParams
) => {
	const address = await prisma.deliveryAddress.create({
		data: params
	});

	return address;
};

interface UpdateDeliveryAddressParams {
	name?: string;
}

export const updateDeliveryAddress = async (
	prisma: PrismaClient,
	addressId: string,
	params: UpdateDeliveryAddressParams
) => {
	const address = await prisma.deliveryAddress.update({
		where: { id: addressId },
		data: params
	});

	return address;
};

export const getDeliveryAddressById = async (
	prisma: PrismaClient,
	addressId: string
) => {
	const address = await prisma.deliveryAddress.findUnique({
		where: { id: addressId }
	});

	return address;
};

export const getDeliveryAddressesByUserId = async (
	prisma: PrismaClient,
	userId: string
) => {
	const addresses = await prisma.deliveryAddress.findMany({
		where: { userId },
		orderBy: { createdAt: 'desc' }
	});

	return addresses;
};

export const deleteDeliveryAddress = async (
	prisma: PrismaClient,
	addressId: string
) => {
	await prisma.deliveryAddress.delete({
		where: { id: addressId }
	});
};
