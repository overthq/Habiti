import { Icon, Screen } from '@market/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';

import ProductList from '../components/products/ProductList';
import ProductsFilter from '../components/products/ProductsFilter';
import { AppStackParamList, ProductsStackParamList } from '../types/navigation';

const Products: React.FC = () => {
	const { navigate, setOptions } =
		useNavigation<NavigationProp<AppStackParamList & ProductsStackParamList>>();

	React.useLayoutEffect(() => {
		setOptions({
			title: 'Products',
			headerRight: () => (
				<View style={styles.headerActions}>
					<Pressable
						onPress={() => navigate('Products.Search')}
						style={{ marginRight: 12 }}
					>
						<Icon name='search' size={22} />
					</Pressable>
					<Pressable onPress={() => navigate('Add Product')}>
						<Icon name='plus' />
					</Pressable>
				</View>
			)
		});
	}, []);

	return (
		<Screen>
			<ProductsFilter />
			<View style={{ flex: 1 }}>
				<ProductList />
			</View>
		</Screen>
	);
};

const styles = StyleSheet.create({
	headerActions: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center'
	}
});

export default Products;
