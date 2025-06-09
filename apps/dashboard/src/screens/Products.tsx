import React from 'react';
import { Pressable } from 'react-native';
import { Icon, Screen, ScreenHeader } from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import FAB from '../components/products/FAB';
import ProductList from '../components/products/ProductList';
import { AppStackParamList } from '../types/navigation';

const Products: React.FC = () => {
	const { top } = useSafeAreaInsets();
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();

	const handleOpenFilterSheet = () => {
		navigate('FilterProducts');
	};

	return (
		<Screen style={{ paddingTop: top }}>
			<ScreenHeader
				title='Products'
				right={
					<Pressable onPress={handleOpenFilterSheet}>
						<Icon name='sliders-horizontal' size={20} />
					</Pressable>
				}
				hasBottomBorder
			/>
			<ProductList />
			<FAB onPress={() => navigate('Add Product')} text='New Product' />
		</Screen>
	);
};

export default Products;
