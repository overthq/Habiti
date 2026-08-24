import type { Context } from 'hono';

import * as AuthLogic from './auth';
import * as AdminSessionData from '../data/adminSessions';
import * as SessionData from '../data/sessions';
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
	const admin = await c.var.prisma.admin.findUnique({
		where: { email: input.email }
	});

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

	const accessToken = await AuthLogic.generateAccessToken({
		owner: admin,
		role: AuthLogic.AccessTokenRole.Admin,
		sessionId: refreshResult.sessionId
	});

	return { accessToken, refreshToken: refreshResult.token, adminId: admin.id };
};

export const getAdminOverview = async (c: Context<AppEnv>) => {
	const [totalStores, totalOrders, totalProducts, totalUsers, totalRevenue] =
		await c.var.prisma.$transaction([
			c.var.prisma.store.count({ where: { unlisted: false } }),
			c.var.prisma.order.count({ where: { store: { unlisted: false } } }),
			c.var.prisma.product.count({ where: { store: { unlisted: false } } }),
			c.var.prisma.user.count(),
			c.var.prisma.order.aggregate({
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

export const bulkUpdateUsers = async (
	c: Context<AppEnv>,
	ids: string[],
	field: 'suspended',
	value: boolean
) => {
	return c.var.prisma.$transaction(async prisma => {
		const result = await prisma.user.updateMany({
			where: { id: { in: ids } },
			data: { [field]: value }
		});
		return { count: result.count };
	});
};

export const bulkDeleteUsers = async (c: Context<AppEnv>, ids: string[]) => {
	return c.var.prisma.$transaction(async prisma => {
		const result = await prisma.user.deleteMany({
			where: { id: { in: ids } }
		});
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
		const result = await prisma.order.updateMany({
			where: { id: { in: ids } },
			data: { [field]: value }
		});
		return { count: result.count };
	});
};

export const bulkDeleteOrders = async (c: Context<AppEnv>, ids: string[]) => {
	return c.var.prisma.$transaction(async prisma => {
		const result = await prisma.order.deleteMany({
			where: { id: { in: ids } }
		});
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
		const result = await prisma.product.updateMany({
			where: { id: { in: ids } },
			data: { [field]: value }
		});
		return { count: result.count };
	});
};

export const bulkDeleteProducts = async (c: Context<AppEnv>, ids: string[]) => {
	return c.var.prisma.$transaction(async prisma => {
		const result = await prisma.product.deleteMany({
			where: { id: { in: ids } }
		});
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
		const result = await prisma.store.updateMany({
			where: { id: { in: ids } },
			data: { [field]: value }
		});
		return { count: result.count };
	});
};

export const bulkDeleteStores = async (c: Context<AppEnv>, ids: string[]) => {
	return c.var.prisma.$transaction(async prisma => {
		const result = await prisma.store.deleteMany({
			where: { id: { in: ids } }
		});
		return { count: result.count };
	});
};

export const getAdminSessions = async (c: Context<AppEnv>) => {
	if (!c.var.auth?.id || !c.var.isAdmin) {
		throw new LogicError(LogicErrorCode.Forbidden);
	}

	return c.var.prisma.adminSession.findMany({
		where: { adminId: c.var.auth.id, revoked: false },
		orderBy: { lastActiveAt: 'desc' }
	});
};

export const revokeAdminSession = async (
	c: Context<AppEnv>,
	sessionId: string
) => {
	if (!c.var.auth?.id || !c.var.isAdmin) {
		throw new LogicError(LogicErrorCode.Forbidden);
	}

	const session = await c.var.prisma.adminSession.findUnique({
		where: { id: sessionId }
	});

	if (!session || session.adminId !== c.var.auth.id) {
		throw new LogicError(LogicErrorCode.SessionNotFound);
	}

	await AdminSessionData.revokeAdminSession(c.var.prisma, sessionId);
	await SessionData.denySession(c.var.redis, sessionId);
};

/** Admin read of any user's active sessions. */
export const getUserSessions = async (c: Context<AppEnv>, userId: string) => {
	if (!c.var.isAdmin) {
		throw new LogicError(LogicErrorCode.Forbidden);
	}

	return SessionData.getUserSessions(c.var.prisma, userId);
};
