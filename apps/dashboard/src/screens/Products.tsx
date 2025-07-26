import React from 'react';
import { Pressable } from 'react-native';
import { Icon, Screen, ScreenHeader } from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import FAB from '../components/products/FAB';
import ProductList from '../components/products/ProductList';
import { AppStackParamList } from '../types/navigation';
import {
	ProductsProvider,
	useProductsContext
} from '../components/products/ProductsContext';

const Products: React.FC = () => {
	const { top } = useSafeAreaInsets();
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();
	const { openFilterModal } = useProductsContext();

	const handleOpenAddProduct = () => {
		navigate('Add Product');
	};

	return (
		<Screen style={{ paddingTop: top }}>
			<ScreenHeader
				title='Products'
				right={
					<Pressable onPress={openFilterModal}>
						<Icon name='sliders-horizontal' size={20} />
					</Pressable>
				}
				hasBottomBorder
			/>
			<ProductList />
			<FAB onPress={handleOpenAddProduct} text='New Product' />
		</Screen>
	);
};

const ProductsWrapper: React.FC = () => {
	return (
		<ProductsProvider>
			<Products />
		</ProductsProvider>
	);
};

export default ProductsWrapper;
