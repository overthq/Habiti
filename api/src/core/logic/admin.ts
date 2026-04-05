import * as AdminData from '../data/admin';
import * as AuthLogic from './auth';
import type { AppContext } from '../../utils/context';
import { LogicError, LogicErrorCode } from './errors';
import { OrderStatus, ProductStatus } from '../../generated/prisma/client';

interface AdminLoginInput {
	email: string;
	password: string;
	userAgent?: string | undefined;
	ipAddress?: string | undefined;
}

export const adminLogin = async (ctx: AppContext, input: AdminLoginInput) => {
	const admin = await AdminData.getAdminByEmail(ctx.prisma, input.email);

	if (!admin) {
		throw new LogicError(LogicErrorCode.AdminNotFound);
	}

	const correct = await AuthLogic.verifyPassword(
		input.password,
		admin.passwordHash
	);

	if (!correct) {
		throw new LogicError(LogicErrorCode.InvalidCredentials);
	}

	const refreshResult = await AuthLogic.generateAdminRefreshToken(
		ctx,
		admin.id,
		undefined,
		{
			userAgent: input.userAgent,
			ipAddress: input.ipAddress
		}
	);
	const accessToken = await AuthLogic.generateAccessToken(
		admin,
		'admin',
		refreshResult.sessionId
	);

	return { accessToken, refreshToken: refreshResult.token, adminId: admin.id };
};

export const getAdminOverview = async (ctx: AppContext) => {
	return AdminData.getAdminOverview(ctx.prisma);
};

export const bulkUpdateUsers = async (
	ctx: AppContext,
	ids: string[],
	field: 'suspended',
	value: boolean
) => {
	return ctx.prisma.$transaction(async prisma => {
		const result = await AdminData.bulkUpdateUsers(prisma, ids, {
			[field]: value
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

export const bulkUpdateOrders = async (
	ctx: AppContext,
	ids: string[],
	field: 'status',
	value: OrderStatus
) => {
	return ctx.prisma.$transaction(async prisma => {
		const result = await AdminData.bulkUpdateOrders(prisma, ids, {
			[field]: value
		});
		return { count: result.count };
	});
};

export const bulkDeleteOrders = async (ctx: AppContext, ids: string[]) => {
	return ctx.prisma.$transaction(async prisma => {
		const result = await AdminData.bulkDeleteOrders(prisma, ids);
		return { count: result.count };
	});
};

export const bulkUpdateProducts = async (
	ctx: AppContext,
	ids: string[],
	field: 'status',
	value: ProductStatus
) => {
	return ctx.prisma.$transaction(async prisma => {
		const result = await AdminData.bulkUpdateProducts(prisma, ids, {
			[field]: value
		});
		return { count: result.count };
	});
};

export const bulkDeleteProducts = async (ctx: AppContext, ids: string[]) => {
	return ctx.prisma.$transaction(async prisma => {
		const result = await AdminData.bulkDeleteProducts(prisma, ids);
		return { count: result.count };
	});
};

export const bulkUpdateStores = async (
	ctx: AppContext,
	ids: string[],
	field: 'unlisted',
	value: boolean
) => {
	return ctx.prisma.$transaction(async prisma => {
		const result = await AdminData.bulkUpdateStores(prisma, ids, {
			[field]: value
		});
		return { count: result.count };
	});
};

export const bulkDeleteStores = async (ctx: AppContext, ids: string[]) => {
	return ctx.prisma.$transaction(async prisma => {
		const result = await AdminData.bulkDeleteStores(prisma, ids);
		return { count: result.count };
	});
};
