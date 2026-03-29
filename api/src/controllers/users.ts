import { NextFunction, Request, Response } from 'express';
import * as UserLogic from '../core/logic/users';

import { userFiltersSchema } from '../utils/queries';
import { getAppContext } from '../utils/context';

export const getUsers = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const filters = userFiltersSchema.parse(req.query);

	const ctx = getAppContext(req);

	try {
		const users = await UserLogic.getUsers(ctx, filters);

		return res.json({ users });
	} catch (error) {
		return next(error);
	}
};

export const getUser = async (
	req: Request<{ id: string }>,
	res: Response,
	next: NextFunction
) => {
	const { id } = req.params;

	const ctx = getAppContext(req);

	try {
		const user = await UserLogic.getUserById(ctx, id);

		return res.json({ user });
	} catch (error) {
		return next(error);
	}
};

export const updateUser = async (
	req: Request<{ id: string }>,
	res: Response,
	next: NextFunction
) => {
	const { id } = req.params;
	const { name, email } = req.body;

	const ctx = getAppContext(req);

	try {
		const user = await UserLogic.updateUser(ctx, { userId: id, name, email });

		return res.json({ user });
	} catch (error) {
		return next(error);
	}
};
