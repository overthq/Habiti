import React from 'react';
import {
	NavigationProp,
	RouteProp,
	useNavigation,
	useRoute
} from '@react-navigation/native';
import useRefresh from '../../hooks/useRefresh';
import { ProductsStackParamList } from '../../types/navigation';
import { ProductsQuery, useProductsQuery } from '../../types/api';

interface ProductsContextType {
	data: ProductsQuery;
	fetching: boolean;
	refreshing: boolean;
	refresh: () => void;
	onUpdateParams: (params: ProductsStackParamList['ProductsList']) => void;
}

const ProductsContext = React.createContext<ProductsContextType | null>(null);

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({
	children
}) => {
	const { params } =
		useRoute<RouteProp<ProductsStackParamList, 'ProductsList'>>();
	const { setParams } =
		useNavigation<NavigationProp<ProductsStackParamList, 'ProductsList'>>();
	const [{ data, fetching }, refetch] = useProductsQuery({
		variables: params
	});
	const { refreshing, refresh } = useRefresh({ fetching, refetch });

	const handleUpdateParams = (
		newParams: ProductsStackParamList['ProductsList']
	) => {
		setParams({ ...(params || {}), ...newParams });
	};

	return (
		<ProductsContext.Provider
			value={{
				data,
				fetching,
				refreshing,
				refresh,
				onUpdateParams: handleUpdateParams
			}}
		>
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
