import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import ProductsListItem from '../components/products/ProductsListItem';
import { useProductsQuery } from '../types/api';

const Items: React.FC = () => {
	const [{ data }] = useProductsQuery();

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

export default Items;
