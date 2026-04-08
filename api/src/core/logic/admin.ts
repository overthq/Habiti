import type { Context } from 'hono';

import * as AdminData from '../data/admin';
import * as AuthLogic from './auth';
import type { AppEnv } from '../../types/hono';
import { LogicError, LogicErrorCode } from './errors';
import { OrderStatus, ProductStatus } from '../../generated/prisma/client';

interface AdminLoginInput {
	email: string;
	password: string;
	userAgent?: string | undefined;
	ipAddress?: string | undefined;
}

export const adminLogin = async (
	c: Context<AppEnv>,
	input: AdminLoginInput
) => {
	const admin = await AdminData.getAdminByEmail(c.var.prisma, input.email);

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
		c,
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

export const getAdminOverview = async (c: Context<AppEnv>) => {
	return AdminData.getAdminOverview(c.var.prisma);
};

export const bulkUpdateUsers = async (
	c: Context<AppEnv>,
	ids: string[],
	field: 'suspended',
	value: boolean
) => {
	return c.var.prisma.$transaction(async prisma => {
		const result = await AdminData.bulkUpdateUsers(prisma, ids, {
			[field]: value
		});
		return { count: result.count };
	});
};

export const bulkDeleteUsers = async (c: Context<AppEnv>, ids: string[]) => {
	return c.var.prisma.$transaction(async prisma => {
		const result = await AdminData.bulkDeleteUsers(prisma, ids);
		return { count: result.count };
	});
};

export const bulkUpdateOrders = async (
	c: Context<AppEnv>,
	ids: string[],
	field: 'status',
	value: OrderStatus
) => {
	return c.var.prisma.$transaction(async prisma => {
		const result = await AdminData.bulkUpdateOrders(prisma, ids, {
			[field]: value
		});
		return { count: result.count };
	});
};

export const bulkDeleteOrders = async (c: Context<AppEnv>, ids: string[]) => {
	return c.var.prisma.$transaction(async prisma => {
		const result = await AdminData.bulkDeleteOrders(prisma, ids);
		return { count: result.count };
	});
};

export const bulkUpdateProducts = async (
	c: Context<AppEnv>,
	ids: string[],
	field: 'status',
	value: ProductStatus
) => {
	return c.var.prisma.$transaction(async prisma => {
		const result = await AdminData.bulkUpdateProducts(prisma, ids, {
			[field]: value
		});
		return { count: result.count };
	});
};

export const bulkDeleteProducts = async (c: Context<AppEnv>, ids: string[]) => {
	return c.var.prisma.$transaction(async prisma => {
		const result = await AdminData.bulkDeleteProducts(prisma, ids);
		return { count: result.count };
	});
};

export const bulkUpdateStores = async (
	c: Context<AppEnv>,
	ids: string[],
	field: 'unlisted',
	value: boolean
) => {
	return c.var.prisma.$transaction(async prisma => {
		const result = await AdminData.bulkUpdateStores(prisma, ids, {
			[field]: value
		});
		return { count: result.count };
	});
};

export const bulkDeleteStores = async (c: Context<AppEnv>, ids: string[]) => {
	return c.var.prisma.$transaction(async prisma => {
		const result = await AdminData.bulkDeleteStores(prisma, ids);
		return { count: result.count };
	});
};
