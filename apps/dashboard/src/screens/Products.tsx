import React from 'react';
import { Screen } from '@habiti/components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { LinearTransition } from 'react-native-reanimated';

import { ProductsProvider } from '../components/products/ProductsContext';
import FAB from '../components/products/FAB';
import ProductList from '../components/products/ProductList';
import ProductsScreenHeader from '../components/products/ProductsScreenHeader';

import { MainTabScreenProps } from '../navigation/types';

const Products = ({ navigation }: MainTabScreenProps<'Products'>) => {
	const { top } = useSafeAreaInsets();

	const handleOpenAddProduct = () => {
		navigation.navigate('Modal.AddProduct');
	};

	return (
		<ProductsProvider>
			<Screen style={{ paddingTop: top }}>
				<ProductsScreenHeader />
				<Animated.View style={{ flex: 1 }} layout={LinearTransition}>
					<ProductList />
				</Animated.View>
				<FAB onPress={handleOpenAddProduct} text='New Product' />
			</Screen>
		</ProductsProvider>
	);
};

export default Products;
