import { PrismaClient } from '../../generated/prisma/client';

export interface GlobalSearchOptions {
	includeUnlisted?: boolean;
}

export const globalSearch = async (
	prisma: PrismaClient,
	query: string,
	options: GlobalSearchOptions = {}
) => {
	const { includeUnlisted = false } = options;

	const [products, stores] = await Promise.all([
		prisma.product.findMany({
			where: {
				name: { contains: query, mode: 'insensitive' },
				...(includeUnlisted ? {} : { store: { unlisted: false } })
			},
			include: {
				images: true
			}
		}),
		prisma.store.findMany({
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
