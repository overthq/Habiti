import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import ItemsListItem from '../components/items/ItemsListItem';
import { useItemsQuery } from '../types/api';

// TODO:
// - Create a "final" list of all the fields on the Item types
// - Seed the database with test data
// - Add the urql provider, passing in the activeStore information as a header, which should also be interpreted on the server side.
// - Add a role for the "store_managers", to be used when generating the JWT on the server side.
// - Handle item variants (colors, sizes etc.), and their prices. This becomes very tricky with combining variants, introducing subtotals and stuff.
// ---------------------------------
// Item:
// name
// description
// price_per_unit
// unit
// created_at
// updated_at
// ----------------------------------
// Item Variant:
// variant (color, size, type etc)
// price_per_unit

const Items: React.FC = () => {
	const [{ data }] = useItemsQuery();

	return (
		<View style={styles.container}>
			<FlatList
				data={data?.items}
				renderItem={({ item }) => <ItemsListItem item={item} />}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

export default Items;
