import { Request, Response, NextFunction } from 'express';

import * as AdminLogic from '../core/logic/admin';
import { getAppContext } from '../utils/context';

export const login = async (
	req: Request<{}, { email: string; password: string }>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { email, password } = req.body;
		const ctx = getAppContext(req);
		const result = await AdminLogic.adminLogin(ctx, { email, password });
		return res.json(result);
	} catch (error) {
		return next(error);
	}
};

export const getOverview = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const ctx = getAppContext(req);
		const overview = await AdminLogic.getAdminOverview(ctx);
		return res.status(200).json(overview);
	} catch (error) {
		return next(error);
	}
};
