import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
// import { useItemsQuery } from '../types/api';

const FeaturedProducts = () => {
	// const [{ data }] = useItemsQuery();
	const data = { items: [] as any[] };

	return (
		<FlatList
			horizontal
			data={data?.items}
			keyExtractor={({ id }) => id}
			renderItem={({ item }) => (
				<View key={item.id} style={styles.product}></View>
			)}
		/>
	);
};

const styles = StyleSheet.create({
	product: {}
});

export default FeaturedProducts;
