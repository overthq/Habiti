import { Request, Response } from 'express';

import * as AdminLogic from '../core/logic/admin';
import { getAppContext } from '../utils/context';

export const login = async (
	req: Request<{}, { email: string; password: string }>,
	res: Response
) => {
	const { email, password } = req.body;

	const ctx = getAppContext(req);

	try {
		const { accessToken, adminId } = await AdminLogic.adminLogin(
			ctx,
			email,
			password
		);

		return res.json({ accessToken, adminId });
	} catch (error) {
		return res.status(500).json({ message: (error as Error)?.message });
	}
};

export const getOverview = async (req: Request, res: Response) => {
	const ctx = getAppContext(req);
	const overview = await AdminLogic.getAdminOverview(ctx);

	return res.status(200).json(overview);
};
