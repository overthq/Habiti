import React from 'react';

interface SearchContextValue {
	data: any[];
}

const SearchContext = React.createContext<SearchContextValue>({ data: [] });

interface SearchProviderProps {
	searchTerm: string;
	children: React.ReactNode;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({
	searchTerm,
	children
}) => {
	// Fetch data with searchTerm
	return (
		<SearchContext.Provider value={{ data: [] }}>
			{children}
		</SearchContext.Provider>
	);
};

export default SearchContext;
