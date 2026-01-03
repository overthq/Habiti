import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router';

/**
 * Hook for managing table filter state with URL persistence.
 * Filters are stored in URL search params for shareability and refresh persistence.
 */
export function useTableFilters<T extends object>(config: { defaults: T }) {
	const [searchParams, setSearchParams] = useSearchParams();

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
					// For undefined defaults, keep as string
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

	// Update a single filter value
	const setFilter = useCallback(
		<K extends keyof T>(key: K, value: T[K]) => {
			setSearchParams(
				prev => {
					const newParams = new URLSearchParams(prev);

					if (value === undefined || value === '' || value === null) {
						newParams.delete(String(key));
					} else if (typeof value === 'object' && String(key) === 'orderBy') {
						// Clear existing orderBy params
						Array.from(newParams.keys())
							.filter(k => k.startsWith('orderBy.'))
							.forEach(k => newParams.delete(k));

						// Set new orderBy params
						const orderByValue = value as Record<string, 'asc' | 'desc'>;
						for (const [field, direction] of Object.entries(orderByValue)) {
							newParams.set(`orderBy.${field}`, direction);
						}
					} else {
						newParams.set(String(key), String(value));
					}

					return newParams;
				},
				{ replace: true }
			);
		},
		[setSearchParams]
	);

	// Update multiple filters at once
	const setFilters = useCallback(
		(newFilters: Partial<T>) => {
			setSearchParams(
				prev => {
					const newParams = new URLSearchParams(prev);

					for (const [key, value] of Object.entries(newFilters)) {
						if (value === undefined || value === '' || value === null) {
							newParams.delete(key);
						} else if (typeof value === 'object' && key === 'orderBy') {
							// Clear existing orderBy params
							Array.from(newParams.keys())
								.filter(k => k.startsWith('orderBy.'))
								.forEach(k => newParams.delete(k));

							// Set new orderBy params
							const orderByValue = value as Record<string, 'asc' | 'desc'>;
							for (const [field, direction] of Object.entries(orderByValue)) {
								newParams.set(`orderBy.${field}`, direction);
							}
						} else {
							newParams.set(key, String(value));
						}
					}

					return newParams;
				},
				{ replace: true }
			);
		},
		[setSearchParams]
	);

	// Clear all filters
	const clearFilters = useCallback(() => {
		setSearchParams(new URLSearchParams(), { replace: true });
	}, [setSearchParams]);

	// Check if any filters are active (different from defaults)
	const hasActiveFilters = useMemo(() => {
		for (const key of Object.keys(config.defaults) as (keyof T)[]) {
			const currentValue = filters[key];
			const defaultValue = config.defaults[key];

			if (currentValue !== defaultValue && currentValue !== undefined) {
				return true;
			}
		}

		// Check for orderBy in URL
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
