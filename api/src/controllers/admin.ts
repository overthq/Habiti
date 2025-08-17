import { Request, Response } from 'express';

import prisma from '../config/prisma';
import * as AuthLogic from '../core/logic/auth';

export const createAdmin = async (req: Request, res: Response) => {
	const { name, email, password } = req.body;

	const passwordHash = await AuthLogic.hashPassword(password);

	const admin = await prisma.admin.create({
		data: { name, email, passwordHash }
	});

	return res.status(201).json({ admin });
};

export const login = async (req: Request, res: Response) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).json({ error: 'Email and password are required' });
	}

	const admin = await prisma.admin.findUnique({ where: { email } });

	if (!admin) {
		return res.status(401).json({ error: 'Invalid credentials' });
	}

	const correct = await AuthLogic.verifyPassword(password, admin.passwordHash);

	if (!correct) {
		return res.status(401).json({ error: 'Invalid credentials' });
	}

	const accessToken = await AuthLogic.generateAccessToken(admin, 'admin');

	return res.json({ accessToken, adminId: admin.id });
};

export const getOverview = async (_: Request, res: Response) => {
	const [totalStores, totalOrders, totalProducts, totalUsers, totalRevenue] =
		await prisma.$transaction([
			prisma.store.count({ where: { unlisted: false } }),
			prisma.order.count({ where: { store: { unlisted: false } } }),
			prisma.product.count({ where: { store: { unlisted: false } } }),
			prisma.user.count(),
			prisma.order.aggregate({
				where: {
					store: { unlisted: false },
					status: 'Completed'
				},
				_sum: { total: true }
			})
		]);

	return res.status(200).json({
		totalStores,
		totalOrders,
		totalProducts,
		totalUsers,
		totalRevenue: totalRevenue._sum.total
	});
};
