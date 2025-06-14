import { PrismaClient } from '@prisma/client';

interface CreateUserParams {
	name: string;
	email: string;
	passwordHash: string;
}

interface UpdateUserParams {
	name?: string;
	email?: string;
	passwordHash?: string;
	suspended?: boolean;
}

export const createUser = async (
	prisma: PrismaClient,
	params: CreateUserParams
) => {
	const user = await prisma.user.create({
		data: params
	});

	return user;
};

export const updateUser = async (
	prisma: PrismaClient,
	userId: string,
	params: UpdateUserParams
) => {
	const user = await prisma.user.update({
		where: { id: userId },
		data: params
	});

	return user;
};

export const getUserById = async (prisma: PrismaClient, userId: string) => {
	const user = await prisma.user.findUnique({
		where: { id: userId }
	});

	return user;
};

export const getUserByEmail = async (prisma: PrismaClient, email: string) => {
	const user = await prisma.user.findUnique({
		where: { email }
	});

	return user;
};

export const deleteUser = async (prisma: PrismaClient, userId: string) => {
	await prisma.user.delete({
		where: { id: userId }
	});
};
