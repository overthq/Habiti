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
import Animated, { LinearTransition } from 'react-native-reanimated';

const Products: React.FC = () => {
	const { top } = useSafeAreaInsets();
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();
	const { openFilterModal, search, setSearch } = useProductsContext();

	const handleOpenAddProduct = () => {
		navigate('Add Product');
	};

	return (
		<Screen style={{ paddingTop: top }}>
			<ScreenHeader
				title='Products'
				search={{
					placeholder: 'Search products',
					value: search,
					onChangeText: setSearch
				}}
				right={
					<Pressable onPress={openFilterModal}>
						<Icon name='sliders-horizontal' size={20} />
					</Pressable>
				}
				hasBottomBorder
			/>
			<Animated.View style={{ flex: 1 }} layout={LinearTransition}>
				<ProductList />
			</Animated.View>
			<FAB onPress={handleOpenAddProduct} text='New Product' />
		</Screen>
	);
};

const ProductsWrapper = () => {
	return (
		<ProductsProvider>
			<Products />
		</ProductsProvider>
	);
};

export default ProductsWrapper;
