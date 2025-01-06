import { Request, Response } from 'express';

import prisma from '../config/prisma';

export default class AdminController {
	public async createAdmin(req: Request, res: Response) {
		const { name, email, password } = req.body;

		const admin = await prisma.admin.create({
			data: {
				name,
				email,
				passwordHash: '' // TODO: hash password
			}
		});

		return res.status(201).json({ admin });
	}

	public async login(req: Request, res: Response) {
		const { email, password } = req.body;

		const admin = await prisma.admin.findUnique({ where: { email } });

		if (!admin) {
			return res.status(401).json({ error: 'Invalid credentials' });
		}

		return res.json({ admin });
	}
}
