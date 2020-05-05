import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useItemsQuery } from '../types';

const FeaturedItems = () => {
	const [{ data }] = useItemsQuery();

	return (
		<FlatList
			horizontal
			data={data?.items}
			keyExtractor={({ _id }) => _id}
			renderItem={({ item }) => (
				<View key={item._id} style={styles.itemContainer}></View>
			)}
		/>
	);
};

const styles = StyleSheet.create({
	itemContainer: {}
});

export default FeaturedItems;
