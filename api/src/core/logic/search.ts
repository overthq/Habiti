import type { Context } from 'hono';

import { ProductStatus } from '../../generated/prisma/client';
import type { AppEnv } from '../../types/hono';

export const globalSearch = async (c: Context<AppEnv>, query: string) => {
	const includeUnlisted = c.var.isAdmin;

	const [products, stores] = await Promise.all([
		c.var.prisma.product.findMany({
			where: {
				name: { contains: query, mode: 'insensitive' },
				status: { not: ProductStatus.Archived },
				...(includeUnlisted ? {} : { store: { unlisted: false } })
			},
			include: {
				images: true
			}
		}),
		c.var.prisma.store.findMany({
			where: {
				name: { contains: query, mode: 'insensitive' },
				...(includeUnlisted ? {} : { unlisted: false })
			},
			include: {
				image: true
			}
		})
	]);

	return { products, stores };
};
