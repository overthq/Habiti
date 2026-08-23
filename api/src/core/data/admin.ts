import { PrismaClient } from '../../generated/prisma/client';

interface CreateAdminParams {
	name: string;
	email: string;
	passwordHash: string;
}

// Unreferenced: together with `hashPassword` in core/logic/auth.ts, the only
// admin-provisioning primitive in the codebase. Kept until it either gets a
// script or goes for good.
export const createAdmin = async (
	prisma: PrismaClient,
	params: CreateAdminParams
) => {
	return prisma.admin.create({
		data: params
	});
};
