import React from 'react';
import { CombinedError } from 'urql';

import { SearchQuery, useSearchQuery } from '../../types/api';
import useDebounced from '../../hooks/useDebounced';
interface SearchContextValue {
	fetching: boolean;
	products: SearchQuery['products'];
	stores: SearchQuery['stores'];
	error: CombinedError;
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

	const [{ fetching, error, data }] = useSearchQuery({
		variables: { searchTerm: debouncedSearchTerm }
	});

	return (
		<SearchContext.Provider
			value={{
				fetching,
				error,
				stores: data?.stores ?? [],
				products: data?.products
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
