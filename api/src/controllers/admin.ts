import argon2 from 'argon2';
import { Request, Response } from 'express';
import { z } from 'zod';
import { PayoutStatus } from '@prisma/client';

import prisma from '../config/prisma';
import { generateAccessToken } from '../utils/auth';
import { hydrateQuery } from '../utils/queries';

export async function createAdmin(req: Request, res: Response) {
	const { name, email, password } = req.body;

	const passwordHash = await argon2.hash(password);

	const admin = await prisma.admin.create({
		data: { name, email, passwordHash }
	});

	return res.status(201).json({ admin });
}

export async function login(req: Request, res: Response) {
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

/**
 * Get all payouts with optional filtering and sorting
 *
 * Supported query parameters:
 * - storeId[equals]=<storeId> - Filter by store ID
 * - status[equals]=<status> - Filter by payout status (Pending, Success, Failure)
 * - amount[gte]=<number> - Filter by minimum amount
 * - amount[lte]=<number> - Filter by maximum amount
 * - amount[gt]=<number> - Filter by amount greater than
 * - amount[lt]=<number> - Filter by amount less than
 * - createdAt[gte]=<date> - Filter by creation date (after or equal)
 * - createdAt[lte]=<date> - Filter by creation date (before or equal)
 * - orderBy[createdAt]=asc|desc - Sort by creation date
 * - orderBy[amount]=asc|desc - Sort by amount
 * - orderBy[status]=asc|desc - Sort by status
 *
 * Example: /admin/payouts?status[equals]=Pending&amount[gte]=10000&orderBy[createdAt]=desc
 */
export const getPayouts = async (req: Request, res: Response) => {
	const query = hydrateQuery(req.query);

	const payouts = await prisma.payout.findMany({
		...query,
		include: {
			store: {
				select: {
					id: true,
					name: true,
					description: true,
					unlisted: true
				}
			}
		}
	});

	return res.status(200).json({ payouts });
};

export const getPayout = async (req: Request, res: Response) => {
	const { id } = req.params;

	if (!id) {
		return res.status(400).json({ error: 'Payout ID is required' });
	}

	const payout = await prisma.payout.findUnique({
		where: { id },
		include: {
			store: {
				select: {
					id: true,
					name: true,
					description: true,
					unlisted: true,
					bankAccountNumber: true,
					bankCode: true
				}
			}
		}
	});

	if (!payout) {
		return res.status(404).json({ error: 'Payout not found' });
	}

	return res.status(200).json({ payout });
};

const updatePayoutSchema = z.object({
	status: z.nativeEnum(PayoutStatus)
});

export const updatePayout = async (req: Request, res: Response) => {
	const { id } = req.params;

	if (!id) {
		return res.status(400).json({ error: 'Payout ID is required' });
	}

	try {
		const { status } = updatePayoutSchema.parse(req.body);

		const payout = await prisma.payout.findUnique({
			where: { id }
		});

		if (!payout) {
			return res.status(404).json({ error: 'Payout not found' });
		}

		// If updating to Success status, increment the store's paidOut amount
		const updatedPayout = await prisma.$transaction(async tx => {
			const updated = await tx.payout.update({
				where: { id },
				data: { status },
				include: {
					store: {
						select: {
							id: true,
							name: true,
							description: true,
							unlisted: true
						}
					}
				}
			});

			// If marking as successful and wasn't already successful, update store paidOut
			if (
				status === PayoutStatus.Success &&
				payout.status !== PayoutStatus.Success
			) {
				await tx.store.update({
					where: { id: payout.storeId },
					data: { paidOut: { increment: payout.amount } }
				});
			}

			return updated;
		});

		return res.status(200).json({ payout: updatedPayout });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return res
				.status(400)
				.json({ error: 'Invalid request body', details: error.errors });
		}
		throw error;
	}
};
