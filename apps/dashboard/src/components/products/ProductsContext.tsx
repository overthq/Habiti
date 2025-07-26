import React from 'react';
import {
	NavigationProp,
	RouteProp,
	useNavigation,
	useRoute
} from '@react-navigation/native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import useRefresh from '../../hooks/useRefresh';
import { ProductsStackParamList } from '../../types/navigation';
import { ProductsQuery, useProductsQuery } from '../../types/api';
import ProductsFilterModal from './ProductsFilterModal';

interface ProductsContextType {
	data: ProductsQuery;
	fetching: boolean;
	refreshing: boolean;
	refresh: () => void;
	openFilterModal: () => void;
}

const ProductsContext = React.createContext<ProductsContextType | null>(null);

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({
	children
}) => {
	const filterModalRef = React.useRef<BottomSheetModal>(null);
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

	const openFilterModal = React.useCallback(() => {
		filterModalRef.current?.present();
	}, []);

	return (
		<ProductsContext.Provider
			value={{
				data,
				fetching,
				refreshing,
				refresh,
				openFilterModal
			}}
		>
			{children}
			<ProductsFilterModal
				modalRef={filterModalRef}
				onUpdateParams={handleUpdateParams}
			/>
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
