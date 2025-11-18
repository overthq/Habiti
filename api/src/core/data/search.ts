import { PrismaClient } from '@prisma/client';

export const globalSearch = async (prisma: PrismaClient, query: string) => {
	const [products, stores] = await prisma.$transaction(async tx => [
		tx.product.findMany({
			where: { name: { contains: query, mode: 'insensitive' } },
			include: {
				images: true
			}
		}),
		tx.store.findMany({
			where: { name: { contains: query, mode: 'insensitive' } },
			include: {
				image: true
			}
		})
	]);

	return { products, stores };
};
