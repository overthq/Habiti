import { Screen, ScreenHeader } from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import FAB from '../components/products/FAB';
import HeaderActions from '../components/products/HeaderActions';
import ProductList from '../components/products/ProductList';
import ProductsFilter from '../components/products/ProductsFilter';
import { AppStackParamList } from '../types/navigation';

const Products: React.FC = () => {
	const { top } = useSafeAreaInsets();
	const { navigate, setOptions } =
		useNavigation<NavigationProp<AppStackParamList>>();

	React.useLayoutEffect(() => {
		setOptions({ title: 'Products', headerRight: HeaderActions });
	}, []);

	return (
		<Screen style={{ paddingTop: top }}>
			<ScreenHeader title='Products' />
			<ProductsFilter />
			<View style={{ flex: 1 }}>
				<ProductList />
			</View>
			<FAB onPress={() => navigate('Add Product')} text='New Product' />
		</Screen>
	);
};

export default Products;
