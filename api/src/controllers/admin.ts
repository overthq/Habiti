import argon2 from 'argon2';
import { Request, Response } from 'express';

import prisma from '../config/prisma';
import { generateAccessToken } from '../utils/auth';

export default class AdminController {
	public async createAdmin(req: Request, res: Response) {
		const { name, email, password } = req.body;

		const passwordHash = await argon2.hash(password);

		const admin = await prisma.admin.create({
			data: { name, email, passwordHash }
		});

		return res.status(201).json({ admin });
	}

	public async login(req: Request, res: Response) {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({ error: 'Email and password are required' });
		}

		const admin = await prisma.admin.findUnique({ where: { email } });

		if (!admin) {
			return res.status(401).json({ error: 'Invalid credentials' });
		}

		const correct = await argon2.verify(admin.passwordHash, password);

		if (!correct) {
			return res.status(401).json({ error: 'Invalid credentials' });
		}

		const accessToken = await generateAccessToken(admin, 'admin');

		return res.json({ accessToken, adminId: admin.id });
	}
}
