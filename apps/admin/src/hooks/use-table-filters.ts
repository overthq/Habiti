import { useCallback, useMemo } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';

/**
 * Hook for managing table filter state with URL persistence.
 * Filters are stored in URL search params for shareability and refresh persistence.
 */
export function useTableFilters<T extends object>(config: { defaults: T }) {
	const navigate = useNavigate();
	const search = useSearch({ strict: false }) as Record<string, unknown>;

	// Convert search to URLSearchParams equivalent for processing
	const searchParams = useMemo(() => {
		const params = new URLSearchParams();
		for (const [key, value] of Object.entries(search ?? {})) {
			if (value === undefined || value === null) continue;
			if (typeof value === 'object') {
				if (key === 'orderBy') {
					for (const [field, direction] of Object.entries(
						value as Record<string, string>
					)) {
						params.set(`orderBy.${field}`, direction);
					}
				}
				continue;
			}
			params.set(key, String(value));
		}
		return params;
	}, [search]);

	// Deserialize filters from URL
	const filters = useMemo(() => {
		const result = { ...config.defaults } as T;

		for (const key of Object.keys(config.defaults) as (keyof T)[]) {
			const value = searchParams.get(String(key));
			if (value !== null) {
				const defaultValue = config.defaults[key];

				// Type coercion based on default value type
				if (typeof defaultValue === 'boolean') {
					(result as Record<string, unknown>)[String(key)] = value === 'true';
				} else if (typeof defaultValue === 'number') {
					const parsed = parseFloat(value);
					if (!isNaN(parsed)) {
						(result as Record<string, unknown>)[String(key)] = parsed;
					}
				} else if (defaultValue === undefined) {
					(result as Record<string, unknown>)[String(key)] = value;
				} else {
					(result as Record<string, unknown>)[String(key)] = value;
				}
			}
		}

		// Handle orderBy specially - it's stored as orderBy.field=direction
		const orderBy: Record<string, 'asc' | 'desc'> = {};
		searchParams.forEach((value, key) => {
			if (key.startsWith('orderBy.')) {
				const field = key.replace('orderBy.', '');
				if (value === 'asc' || value === 'desc') {
					orderBy[field] = value;
				}
			}
		});
		if (Object.keys(orderBy).length > 0) {
			(result as Record<string, unknown>).orderBy = orderBy;
		}

		return result;
	}, [searchParams, config.defaults]);

	const updateSearch = useCallback(
		(transform: (params: URLSearchParams) => URLSearchParams) => {
			const next = transform(new URLSearchParams(searchParams));
			const newSearch: Record<string, unknown> = {};
			const orderBy: Record<string, string> = {};
			next.forEach((value, key) => {
				if (key.startsWith('orderBy.')) {
					orderBy[key.replace('orderBy.', '')] = value;
				} else {
					newSearch[key] = value;
				}
			});
			if (Object.keys(orderBy).length > 0) {
				newSearch.orderBy = orderBy;
			}
			navigate({ to: '.', search: newSearch as never, replace: true });
		},
		[navigate, searchParams]
	);

	// Update a single filter value
	const setFilter = useCallback(
		<K extends keyof T>(key: K, value: T[K]) => {
			updateSearch(prev => {
				const newParams = new URLSearchParams(prev);

				if (value === undefined || value === '' || value === null) {
					newParams.delete(String(key));
				} else if (typeof value === 'object' && String(key) === 'orderBy') {
					Array.from(newParams.keys())
						.filter(k => k.startsWith('orderBy.'))
						.forEach(k => newParams.delete(k));

					const orderByValue = value as Record<string, 'asc' | 'desc'>;
					for (const [field, direction] of Object.entries(orderByValue)) {
						newParams.set(`orderBy.${field}`, direction);
					}
				} else {
					newParams.set(String(key), String(value));
				}

				return newParams;
			});
		},
		[updateSearch]
	);

	// Update multiple filters at once
	const setFilters = useCallback(
		(newFilters: Partial<T>) => {
			updateSearch(prev => {
				const newParams = new URLSearchParams(prev);

				for (const [key, value] of Object.entries(newFilters)) {
					if (value === undefined || value === '' || value === null) {
						newParams.delete(key);
					} else if (typeof value === 'object' && key === 'orderBy') {
						Array.from(newParams.keys())
							.filter(k => k.startsWith('orderBy.'))
							.forEach(k => newParams.delete(k));

						const orderByValue = value as Record<string, 'asc' | 'desc'>;
						for (const [field, direction] of Object.entries(orderByValue)) {
							newParams.set(`orderBy.${field}`, direction);
						}
					} else {
						newParams.set(key, String(value));
					}
				}

				return newParams;
			});
		},
		[updateSearch]
	);

	// Clear all filters
	const clearFilters = useCallback(() => {
		navigate({ to: '.', search: {} as never, replace: true });
	}, [navigate]);

	// Check if any filters are active (different from defaults)
	const hasActiveFilters = useMemo(() => {
		for (const key of Object.keys(config.defaults) as (keyof T)[]) {
			const currentValue = filters[key];
			const defaultValue = config.defaults[key];

			if (currentValue !== defaultValue && currentValue !== undefined) {
				return true;
			}
		}

		for (const key of searchParams.keys()) {
			if (key.startsWith('orderBy.')) {
				return true;
			}
		}

		return false;
	}, [filters, config.defaults, searchParams]);

	return {
		filters,
		setFilter,
		setFilters,
		clearFilters,
		hasActiveFilters
	};
}
