export type StringWhere = {
	contains?: string;
	search?: string;
	startsWith?: string;
	endsWith?: string;
	mode?: 'insensitive' | 'default';
};

export type IntWhere = Partial<Record<'lt' | 'lte' | 'gt' | 'gte', number>>;
export type CategoriesWhere = Partial<
	Record<'every' | 'some' | 'none', ProductCategoryWhere>
>;
export type ProductCategoryWhere = {
	productId?: StringWhere;
	categoryId?: StringWhere;
};

export interface ProductsArgs {
	filter: {
		name?: StringWhere;
		unitPrice?: IntWhere;
		quantity?: IntWhere;
		categories?: CategoriesWhere;
	};
	orderBy: {
		createdAt?: 'asc' | 'desc';
		updatedAt?: 'asc' | 'desc';
		unitPrice?: 'asc' | 'desc';
	}[];
}
