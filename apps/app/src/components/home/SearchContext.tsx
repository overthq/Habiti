import React from 'react';

import { useSearchQuery } from '../../data/queries';
import { Product, Store } from '../../data/types';
import useDebounced from '../../hooks/useDebounced';
interface SearchContextValue {
	fetching: boolean;
	products: Product[];
	stores: Store[];
	error: Error | null;
}

const SearchContext = React.createContext<SearchContextValue | null>(null);

interface SearchProviderProps {
	searchTerm: string;
	children: React.ReactNode;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({
	searchTerm,
	children
}) => {
	const debouncedSearchTerm = useDebounced(searchTerm);

	const { isLoading, error, data } = useSearchQuery(debouncedSearchTerm);

	return (
		<SearchContext.Provider
			value={{
				fetching: isLoading,
				error: error ?? null,
				stores: data?.stores ?? [],
				products: data?.products ?? []
			}}
		>
			{children}
		</SearchContext.Provider>
	);
};

export const useSearchContext = () => {
	const searchContext = React.useContext(SearchContext);

	if (!searchContext) {
		throw new Error('useSearchContext must be used in a SearchProvider');
	}

	return searchContext;
};

export default SearchContext;
