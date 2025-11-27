import { PrismaClient } from '@prisma/client';

export const globalSearch = async (prisma: PrismaClient, query: string) => {
	const [products, stores] = await Promise.all([
		prisma.product.findMany({
			where: { name: { contains: query, mode: 'insensitive' } },
			include: {
				images: true
			}
		}),
		prisma.store.findMany({
			where: { name: { contains: query, mode: 'insensitive' } },
			include: {
				image: true
			}
		})
	]);

	return { products, stores };
};
