import React from 'react';

interface SearchContextValue {
	fetching: boolean;
	data: any[];
	error?: any;
}

const SearchContext = React.createContext<SearchContextValue>({
	fetching: true,
	data: []
});

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
		<SearchContext.Provider value={{ fetching: true, data: [] }}>
			{children}
		</SearchContext.Provider>
	);
};

export default SearchContext;
