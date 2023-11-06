import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import ProductList from '../components/products/ProductList';
import ProductsFilter from '../components/products/ProductsFilter';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Icon } from '../components/Icon';
import { AppStackParamList } from '../types/navigation';
import Screen from '../components/global/Screen';

const Products: React.FC = () => {
	const { navigate, setOptions } =
		useNavigation<NavigationProp<AppStackParamList>>();

	React.useLayoutEffect(() => {
		setOptions({
			title: 'Products',
			headerRight: () => (
				<View style={styles.headerActions}>
					{/* <Pressable
							onPress={() => navigation.navigate('SearchProducts')}
							style={{ marginRight: 4 }}
						>
							<Icon name='search' />
						</Pressable> */}
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
				<ProductList mode='list' />
			</View>
		</Screen>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FFFFFF'
	},
	headerActions: {
		flexDirection: 'row',
		alignItems: 'center',
		marginRight: 16
	}
});

export default Products;
