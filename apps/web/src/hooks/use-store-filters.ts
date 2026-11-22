import { useLocation, useNavigate } from '@tanstack/react-router';
import { useCallback, useMemo } from 'react';
import type { ProductFilters } from '@habiti/data';

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
	filters: ProductFilters;
}

export function useStoreFilters(): UseStoreFiltersReturn {
	const location = useLocation();
	const navigate = useNavigate();

	const searchParams = useMemo(() => {
		// location.searchStr is available at runtime; fallback to window.location for SSR-less cases
		const raw =
			(location as any).searchStr ??
			(typeof window !== 'undefined' ? window.location.search : '');
		return new URLSearchParams(raw || '');
	}, [location]);

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
			const newUrl = queryString
				? `${location.pathname}?${queryString}`
				: location.pathname;

			navigate({ to: newUrl, replace: true, resetScroll: false });
		},
		[searchParams, location.pathname, navigate]
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

	const filters = useMemo<ProductFilters>(() => {
		const sortMap: Partial<
			Record<StoreProductsSortOption, ProductFilters['orderBy']>
		> = {
			'newest-to-oldest': { createdAt: 'desc' },
			'highest-to-lowest-price': { unitPrice: 'desc' },
			'lowest-to-highest-price': { unitPrice: 'asc' }
		};

		return {
			orderBy: sortMap[sortBy],
			categoryId: categoryId ?? undefined,
			inStock: inStock || undefined
		};
	}, [sortBy, categoryId, inStock]);

	return {
		sortBy,
		categoryId,
		inStock,
		setSortBy,
		setCategoryId,
		setInStock,
		filters
	};
}
