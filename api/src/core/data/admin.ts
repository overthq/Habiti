import {
	PrismaClient,
	OrderStatus,
	ProductStatus
} from '../../generated/prisma/client';
import type { TransactionClient } from '../../generated/prisma/internal/prismaNamespace';

export const getAdminByEmail = async (prisma: PrismaClient, email: string) => {
	const admin = await prisma.admin.findUnique({ where: { email } });

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

	return {
		totalStores,
		totalOrders,
		totalProducts,
		totalUsers,
		totalRevenue: totalRevenue._sum.total
	};
};

// Bulk User Operations
export const bulkUpdateUsers = async (
	prisma: TransactionClient,
	ids: string[],
	data: { suspended: boolean }
) => {
	return prisma.user.updateMany({
		where: { id: { in: ids } },
		data
	});
};

export const bulkDeleteUsers = async (
	prisma: TransactionClient,
	ids: string[]
) => {
	return prisma.user.deleteMany({
		where: { id: { in: ids } }
	});
};

// Bulk Order Operations
export const bulkUpdateOrders = async (
	prisma: TransactionClient,
	ids: string[],
	data: { status: OrderStatus }
) => {
	return prisma.order.updateMany({
		where: { id: { in: ids } },
		data
	});
};

export const bulkDeleteOrders = async (
	prisma: TransactionClient,
	ids: string[]
) => {
	return prisma.order.deleteMany({
		where: { id: { in: ids } }
	});
};

// Bulk Product Operations
export const bulkUpdateProducts = async (
	prisma: TransactionClient,
	ids: string[],
	data: { status: ProductStatus }
) => {
	return prisma.product.updateMany({
		where: { id: { in: ids } },
		data
	});
};

export const bulkDeleteProducts = async (
	prisma: TransactionClient,
	ids: string[]
) => {
	return prisma.product.deleteMany({
		where: { id: { in: ids } }
	});
};
