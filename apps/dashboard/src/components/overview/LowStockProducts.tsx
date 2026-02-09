import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { SectionHeader, Spacer } from '@habiti/components';
import { useNavigation, NavigationProp } from '@react-navigation/native';

import LowStockProduct from './LowStockProduct';
import { HomeStackParamList, MainTabParamList } from '../../types/navigation';
import { Product } from '../../data/types';

interface LowStockProductsProps {
	products: Product[];
}

const LowStockProducts: React.FC<LowStockProductsProps> = ({ products }) => {
	const { navigate } =
		useNavigation<NavigationProp<HomeStackParamList & MainTabParamList>>();

	const navigateToProduct = (productId: string) => () => {
		navigate('Product', { screen: 'Product.Main', params: { productId } });
	};

	const navigateToProducts = () => {
		// TODO: Pass low stock filter to products screen
		navigate('Products');
	};

	return (
		<View style={styles.container}>
			<SectionHeader
				title='Low Stock'
				action={{ text: 'View all', onPress: navigateToProducts }}
			/>
			<Spacer y={4} />
			<FlatList
				data={products}
				keyExtractor={i => i.id}
				renderItem={({ item }) => (
					<LowStockProduct
						onPress={navigateToProduct(item.id)}
						product={item}
					/>
				)}
				horizontal
				showsHorizontalScrollIndicator={false}
				ListHeaderComponent={<View style={{ width: 16 }} />}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginTop: 16
	},
	heading: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 16,
		marginBottom: 4
	}
});

export default LowStockProducts;
