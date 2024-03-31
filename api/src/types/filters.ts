export type StringWhere = {
	contains?: string;
	search?: string;
	startsWith?: string;
	endsWith?: string;
	mode?: 'insensitive' | 'default';
};

export type IntWhere = Partial<Record<'lt' | 'lte' | 'gt' | 'gte', number>>;

export interface ProductsArgs {
	filter?: {
		name?: StringWhere;
		unitPrice?: IntWhere;
		quantity?: IntWhere;
	};
	orderBy?: {
		createdAt?: 'asc' | 'desc';
		updatedAt?: 'asc' | 'desc';
		unitPrice?: 'asc' | 'desc';
	}[];
}
