import { ResolverContext } from '../../types/resolvers';

interface CreateDeliveryAddressParams {
	userId: string;
	name: string;
	address: string;
	city: string;
	state: string;
	phoneNumber: string;
}

interface UpdateDeliveryAddressParams {
	name?: string;
	address?: string;
	city?: string;
	state?: string;
	phoneNumber?: string;
}

export const createDeliveryAddress = async (
	ctx: ResolverContext,
	params: CreateDeliveryAddressParams
) => {
	const address = await ctx.prisma.deliveryAddress.create({
		data: params
	});

	return address;
};

export const updateDeliveryAddress = async (
	ctx: ResolverContext,
	addressId: string,
	params: UpdateDeliveryAddressParams
) => {
	const address = await ctx.prisma.deliveryAddress.update({
		where: { id: addressId },
		data: params
	});

	return address;
};

export const getDeliveryAddressById = async (
	ctx: ResolverContext,
	addressId: string
) => {
	const address = await ctx.prisma.deliveryAddress.findUnique({
		where: { id: addressId }
	});

	return address;
};

export const getDeliveryAddressesByUserId = async (
	ctx: ResolverContext,
	userId: string
) => {
	const addresses = await ctx.prisma.deliveryAddress.findMany({
		where: { userId },
		orderBy: { createdAt: 'desc' }
	});

	return addresses;
};

export const deleteDeliveryAddress = async (
	ctx: ResolverContext,
	addressId: string
) => {
	await ctx.prisma.deliveryAddress.delete({
		where: { id: addressId }
	});
};
