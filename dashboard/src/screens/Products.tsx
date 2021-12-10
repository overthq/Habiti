import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import ProductsListItem from '../components/products/ProductsListItem';
import { useAppSelector } from '../redux/store';
import { useProductsQuery } from '../types/api';

const Products: React.FC = () => {
	const activeStore = useAppSelector(
		({ preferences }) => preferences.activeStore
	);

	const [{ data }] = useProductsQuery({
		variables: { storeId: activeStore as string }
	});

	return (
		<View style={styles.container}>
			<FlatList
				keyExtractor={i => i.id}
				data={data?.store.products}
				renderItem={({ item }) => <ProductsListItem product={item} />}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FFFFFF'
	}
});

export default Products;
