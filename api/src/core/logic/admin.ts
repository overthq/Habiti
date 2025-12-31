import * as AdminData from '../data/admin';
import * as AuthLogic from './auth';
import type { AppContext } from '../../utils/context';
import { LogicError, LogicErrorCode } from './errors';

interface AdminLoginInput {
	email: string;
	password: string;
}

export const adminLogin = async (
	ctx: AppContext,
	input: AdminLoginInput
): Promise<{ accessToken: string; adminId: string }> => {
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

	const accessToken = await AuthLogic.generateAccessToken(admin, 'admin');

	return { accessToken, adminId: admin.id };
};

export const getAdminOverview = async (
	ctx: AppContext
): Promise<Awaited<ReturnType<typeof AdminData.getAdminOverview>>> => {
	return AdminData.getAdminOverview(ctx.prisma);
};
