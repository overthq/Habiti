import { SectionHeader, Spacer } from '@market/components';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';

import LowStockProduct from './LowStockProduct';
import { useProductsQuery } from '../../types/api';
import { HomeStackParamList, MainTabParamList } from '../../types/navigation';

const LowStockProducts = () => {
	const [{ data }] = useProductsQuery();
	const { navigate } = useNavigation<NavigationProp<MainTabParamList>>();
	const navigation = useNavigation<NavigationProp<HomeStackParamList>>();

	const navigateToProduct = (productId: string) => () => {
		navigation.navigate('Product', { productId });
	};

	const navigateToProducts = () => {
		navigate('Products');
	};

	return (
		<View style={styles.container}>
			<SectionHeader
				title='Low stock products'
				action={{ text: 'View all', onPress: navigateToProducts }}
			/>
			<Spacer y={4} />
			<FlatList
				keyExtractor={i => i.id}
				data={data?.currentStore.products}
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
