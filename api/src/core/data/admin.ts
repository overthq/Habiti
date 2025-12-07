import { PrismaClient } from '../../generated/prisma/client';

export const getAdminByEmail = async (prisma: PrismaClient, email: string) => {
	const admin = await prisma.admin.findUnique({ where: { email } });

	if (!admin) {
		throw new Error('Admin not found');
	}

	return admin;
};

interface CreateAdminParams {
	name: string;
	email: string;
	passwordHash: string;
}

export const createAdmin = async (
	prisma: PrismaClient,
	params: CreateAdminParams
) => {
	return prisma.admin.create({
		data: params
	});
};

export const getAdminOverview = async (prisma: PrismaClient) => {
	const [totalStores, totalOrders, totalProducts, totalUsers, totalRevenue] =
		await prisma.$transaction([
			prisma.store.count({ where: { unlisted: false } }),
			prisma.order.count({ where: { store: { unlisted: false } } }),
			prisma.product.count({ where: { store: { unlisted: false } } }),
			prisma.user.count(),
			prisma.order.aggregate({
				where: {
					store: { unlisted: false },
					status: 'Completed'
				},
				_sum: { total: true }
			})
		]);

	return { totalStores, totalOrders, totalProducts, totalUsers, totalRevenue };
};
