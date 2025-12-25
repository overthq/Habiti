import * as AdminData from '../data/admin';
import * as AuthLogic from './auth';
import type { AppContext } from '../../utils/context';
import { err, ok, Result } from './result';
import { LogicErrorCode } from './errors';

export const adminLogin = async (
	ctx: AppContext,
	email: string,
	password: string
): Promise<
	Result<{ accessToken: string; adminId: string }, LogicErrorCode>
> => {
	try {
		const admin = await AdminData.getAdminByEmail(ctx.prisma, email);

		if (!admin) {
			return err(LogicErrorCode.AdminNotFound);
		}

		const correct = await AuthLogic.verifyPassword(
			password,
			admin.passwordHash
		);

		if (!correct) {
			return err(LogicErrorCode.InvalidCredentials);
		}

		const accessTokenResult = await AuthLogic.generateAccessToken(
			admin,
			'admin'
		);
		if (!accessTokenResult.ok) {
			return err(accessTokenResult.error);
		}

		return ok({ accessToken: accessTokenResult.data, adminId: admin.id });
	} catch (e) {
		console.error('[AdminLogic.adminLogin] Unexpected error', e);
		return err(LogicErrorCode.Unexpected);
	}
};

export const getAdminOverview = async (
	ctx: AppContext
): Promise<
	Result<Awaited<ReturnType<typeof AdminData.getAdminOverview>>, LogicErrorCode>
> => {
	try {
		return ok(await AdminData.getAdminOverview(ctx.prisma));
	} catch (e) {
		console.error('[AdminLogic.getAdminOverview] Unexpected error', e);
		return err(LogicErrorCode.Unexpected);
	}
};
