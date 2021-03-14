import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import ItemsListItem from '../components/items/ItemsListItem';
import { useItemsQuery } from '../types/api';

const Items: React.FC = () => {
	const [{ data }] = useItemsQuery();

	return (
		<View style={styles.container}>
			<FlatList
				keyExtractor={i => i.id}
				data={data?.items}
				renderItem={({ item }) => <ItemsListItem item={item} />}
				ItemSeparatorComponent={() => (
					<View
						style={{ width: '100%', height: 1, backgroundColor: '#D3D3D3' }}
					/>
				)}
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
