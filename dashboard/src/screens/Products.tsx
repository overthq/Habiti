import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import ItemsListItem from '../components/items/ItemsListItem';
import { useProductsQuery } from '../types/api';

const Items: React.FC = () => {
	const [{ data }] = useProductsQuery();

	return (
		<View style={styles.container}>
			<FlatList
				keyExtractor={i => i.id}
				data={data?.store.products}
				renderItem={({ item }) => <ItemsListItem item={item} />}
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
