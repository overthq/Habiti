import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback, useMemo } from 'react';

export type StoreProductsSortOption =
	| 'default'
	| 'newest-to-oldest'
	| 'highest-to-lowest-price'
	| 'lowest-to-highest-price';

interface UseStoreFiltersReturn {
	sortBy: StoreProductsSortOption;
	categoryId: string | null;
	inStock: boolean;
	setSortBy: (value: StoreProductsSortOption) => void;
	setCategoryId: (value: string | null) => void;
	setInStock: (value: boolean) => void;
	queryParams: URLSearchParams;
}

export function useStoreFilters(): UseStoreFiltersReturn {
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();

	const sortBy =
		(searchParams.get('sortBy') as StoreProductsSortOption) || 'default';
	const categoryId = searchParams.get('categoryId');
	const inStock = searchParams.get('inStock') === 'true';

	const updateParams = useCallback(
		(updates: Record<string, string | null>) => {
			const params = new URLSearchParams(searchParams.toString());

			Object.entries(updates).forEach(([key, value]) => {
				if (value === null || value === 'default') {
					params.delete(key);
				} else {
					params.set(key, value);
				}
			});

			const queryString = params.toString();
			const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

			router.replace(newUrl, { scroll: false });
		},
		[searchParams, pathname, router]
	);

	const setSortBy = useCallback(
		(value: StoreProductsSortOption) => {
			updateParams({ sortBy: value === 'default' ? null : value });
		},
		[updateParams]
	);

	const setCategoryId = useCallback(
		(value: string | null) => {
			updateParams({ categoryId: value });
		},
		[updateParams]
	);

	const setInStock = useCallback(
		(value: boolean) => {
			updateParams({ inStock: value ? 'true' : null });
		},
		[updateParams]
	);

	const queryParams = useMemo(() => {
		const params = new URLSearchParams();

		const sortMap: Partial<Record<StoreProductsSortOption, [string, string]>> =
			{
				'newest-to-oldest': ['orderBy[createdAt]', 'desc'],
				'highest-to-lowest-price': ['orderBy[unitPrice]', 'desc'],
				'lowest-to-highest-price': ['orderBy[unitPrice]', 'asc']
			};

		const sortValue = sortMap[sortBy];
		if (sortValue) {
			params.set(sortValue[0], sortValue[1]);
		}

		if (categoryId) {
			params.set('categoryId', categoryId);
		}

		if (inStock) {
			params.set('inStock', 'true');
		}

		return params;
	}, [sortBy, categoryId, inStock]);

	return {
		sortBy,
		categoryId,
		inStock,
		setSortBy,
		setCategoryId,
		setInStock,
		queryParams
	};
}
