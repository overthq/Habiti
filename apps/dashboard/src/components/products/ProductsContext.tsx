import React from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import useRefresh from '../../hooks/useRefresh';
import { MainTabParamList } from '../../types/navigation';
import { ProductsQuery, useProductsQuery } from '../../types/api';

interface ProductsContextType {
	data: ProductsQuery;
	fetching: boolean;
	refreshing: boolean;
	refresh: () => void;
}

const ProductsContext = React.createContext<ProductsContextType | null>(null);

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({
	children
}) => {
	const { params } = useRoute<RouteProp<MainTabParamList, 'Products'>>();
	const [{ data, fetching }, refetch] = useProductsQuery({
		variables: params
	});
	const { refreshing, refresh } = useRefresh({ fetching, refetch });

	return (
		<ProductsContext.Provider value={{ data, fetching, refreshing, refresh }}>
			{children}
		</ProductsContext.Provider>
	);
};

export const useProductsContext = () => {
	const context = React.useContext(ProductsContext);

	if (!context) {
		throw new Error(
			'useProductsContext must be used within a ProductsProvider'
		);
	}

	return context;
};
