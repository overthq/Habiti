import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
// import { useItemsQuery } from '../types/api';
import { items } from '../api';

const FeaturedItems = () => {
	// const [{ data }] = useItemsQuery();

	return (
		<FlatList
			horizontal
			data={items}
			keyExtractor={({ id }) => id}
			renderItem={({ item }) => (
				<View key={item.id} style={styles.itemContainer}></View>
			)}
		/>
	);
};

const styles = StyleSheet.create({
	itemContainer: {}
});

export default FeaturedItems;
