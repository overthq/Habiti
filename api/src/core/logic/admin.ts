import * as AdminData from '../data/admin';
import * as AuthLogic from './auth';
import type { AppContext } from '../../utils/context';
import { LogicError, LogicErrorCode } from './errors';
import { OrderStatus, ProductStatus } from '../../generated/prisma/client';

interface AdminLoginInput {
	email: string;
	password: string;
}

export const adminLogin = async (ctx: AppContext, input: AdminLoginInput) => {
	const admin = await AdminData.getAdminByEmail(ctx.prisma, input.email);

	console.log({ admin });

	if (!admin) {
		throw new LogicError(LogicErrorCode.AdminNotFound);
	}

	console.log({ admin });

	const correct = await AuthLogic.verifyPassword(
		input.password,
		admin.passwordHash
	);

	console.log({ correct });

	if (!correct) {
		throw new LogicError(LogicErrorCode.InvalidCredentials);
	}

	const accessToken = await AuthLogic.generateAccessToken(admin, 'admin');

	console.log({ accessToken });

	return { accessToken, adminId: admin.id };
};

export const getAdminOverview = async (ctx: AppContext) => {
	return AdminData.getAdminOverview(ctx.prisma);
};

// Bulk User Operations
export const bulkSuspendUsers = async (ctx: AppContext, ids: string[]) => {
	return ctx.prisma.$transaction(async prisma => {
		const result = await AdminData.bulkUpdateUsers(prisma, ids, {
			suspended: true
		});
		return { count: result.count };
	});
};

export const bulkUnsuspendUsers = async (ctx: AppContext, ids: string[]) => {
	return ctx.prisma.$transaction(async prisma => {
		const result = await AdminData.bulkUpdateUsers(prisma, ids, {
			suspended: false
		});
		return { count: result.count };
	});
};

export const bulkDeleteUsers = async (ctx: AppContext, ids: string[]) => {
	return ctx.prisma.$transaction(async prisma => {
		const result = await AdminData.bulkDeleteUsers(prisma, ids);
		return { count: result.count };
	});
};

// Bulk Order Operations
export const bulkCancelOrders = async (ctx: AppContext, ids: string[]) => {
	return ctx.prisma.$transaction(async prisma => {
		const result = await AdminData.bulkUpdateOrders(prisma, ids, {
			status: OrderStatus.Cancelled
		});
		return { count: result.count };
	});
};

export const bulkUpdateOrderStatus = async (
	ctx: AppContext,
	ids: string[],
	status: OrderStatus
) => {
	return ctx.prisma.$transaction(async prisma => {
		const result = await AdminData.bulkUpdateOrders(prisma, ids, { status });
		return { count: result.count };
	});
};

// Bulk Product Operations
export const bulkDeleteProducts = async (ctx: AppContext, ids: string[]) => {
	return ctx.prisma.$transaction(async prisma => {
		const result = await AdminData.bulkDeleteProducts(prisma, ids);
		return { count: result.count };
	});
};

export const bulkUpdateProductStatus = async (
	ctx: AppContext,
	ids: string[],
	status: ProductStatus
) => {
	return ctx.prisma.$transaction(async prisma => {
		const result = await AdminData.bulkUpdateProducts(prisma, ids, { status });
		return { count: result.count };
	});
};
