import { Request, Response, NextFunction } from 'express';

import * as AdminLogic from '../core/logic/admin';
import { getAppContext } from '../utils/context';
import { logicErrorToApiException } from '../core/logic/errors';

export const login = async (
	req: Request<{}, { email: string; password: string }>,
	res: Response,
	next: NextFunction
) => {
	const { email, password } = req.body;

	const ctx = getAppContext(req);

	const result = await AdminLogic.adminLogin(ctx, email, password);

	if (!result.ok) {
		return next(logicErrorToApiException(result.error));
	}

	return res.json(result.data);
};

export const getOverview = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const ctx = getAppContext(req);
	const overviewResult = await AdminLogic.getAdminOverview(ctx);

	if (!overviewResult.ok) {
		return next(logicErrorToApiException(overviewResult.error));
	}

	return res.status(200).json(overviewResult.data);
};
