import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import ProductsListItem from '../components/products/ProductsListItem';
import useStore from '../state';
import { useProductsQuery } from '../types/api';

// TODO: Create a grid view for this screen.
// For now, it makes sense to have this be a list.
// However, a grid is much more aesthetic, and makes it easier for users to
// find items while scrolling.

const Products: React.FC = () => {
	const activeStore = useStore(state => state.activeStore);

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
		backgroundColor: '#FFFFFF',
		paddingTop: 16
	}
});

export default Products;
