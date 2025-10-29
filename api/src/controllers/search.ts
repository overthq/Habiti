import { Request, Response } from 'express';
import prismaClient from '../config/prisma';

export const globalSearch = async (req: Request, res: Response) => {
	const { query } = req.query;

	if (!query || typeof query !== 'string') {
		return res.json({ products: [], stores: [] });
	}

	const [products, stores] = await Promise.all([
		prismaClient.product.findMany({
			where: { name: { contains: query, mode: 'insensitive' } },
			include: {
				images: true
			}
		}),
		prismaClient.store.findMany({
			where: { name: { contains: query, mode: 'insensitive' } },
			include: {
				image: true
			}
		})
	]);

	return res.json({ products, stores });
};
