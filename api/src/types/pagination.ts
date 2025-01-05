export type PaginationArgs = {
	first?: number;
	after?: string;
	last?: number;
	before?: string;
};

export type Edge<T> = {
	cursor: string;
	node: T;
};

export type PageInfo = {
	hasNextPage: boolean;
	hasPreviousPage: boolean;
	startCursor: string | undefined;
	endCursor: string | undefined;
};

export type Connection<T> = {
	edges: Edge<T>[];
	pageInfo: PageInfo;
	totalCount: number;
};

export const DEFAULT_PAGE_SIZE = 20;
