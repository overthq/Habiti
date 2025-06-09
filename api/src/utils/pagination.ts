import {
	PaginationArgs,
	Connection,
	Edge,
	PageInfo
} from '../types/pagination';

export const paginateQuery = async <T extends { id: string }>(
	args: PaginationArgs,
	queryFn: (take: number, cursor?: string) => Promise<T[]>,
	countFn: () => Promise<number>,
	defaultPageSize = 20
): Promise<Connection<T>> => {
	const { first, after, last, before } = args;

	if (first && last) {
		throw new Error('Cannot specify both first and last');
	}

	if (first && first < 0) {
		throw new Error('First cannot be negative');
	}

	if (last && last < 0) {
		throw new Error('Last cannot be negative');
	}

	const limit = first || last || defaultPageSize;
	const cursor = after || before;

	// Fetch one extra item to determine if there are more pages
	const items = await queryFn(limit + 1, cursor);
	const hasMore = items.length > limit;
	const nodes = hasMore ? items.slice(0, limit) : items;

	const edges: Edge<T>[] = nodes.map(node => ({
		cursor: Buffer.from(node.id).toString('base64'),
		node
	}));

	const pageInfo: PageInfo = {
		hasNextPage: first ? hasMore : false,
		hasPreviousPage: last ? hasMore : false,
		startCursor: edges[0]?.cursor,
		endCursor: edges[edges.length - 1]?.cursor
	};

	const totalCount = await countFn();

	return { edges, pageInfo, totalCount };
};

export const decodeCursor = (cursor: string): string => {
	return Buffer.from(cursor, 'base64').toString('utf-8');
};
