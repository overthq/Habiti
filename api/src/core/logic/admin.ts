import * as AdminData from '../data/admin';
import * as AuthLogic from './auth';
import type { AppContext } from '../../utils/context';

export const adminLogin = async (
	ctx: AppContext,
	email: string,
	password: string
) => {
	const admin = await AdminData.getAdminByEmail(ctx.prisma, email);

	if (!admin) {
		throw new Error('Admin not found');
	}

	const correct = await AuthLogic.verifyPassword(password, admin.passwordHash);

	if (!correct) {
		throw new Error('Invalid credentials');
	}

	const accessToken = await AuthLogic.generateAccessToken(admin);

	return { accessToken, adminId: admin.id };
};

export const getAdminOverview = async (ctx: AppContext) => {
	return AdminData.getAdminOverview(ctx.prisma);
};
