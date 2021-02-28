import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useItemsQuery } from '../../types/api';
import WatchlistItem from './WatchlistItem';

const Watchlist = () => {
	const [{ data }] = useItemsQuery();

	return (
		<View>
			<Text style={styles.sectionHeader}>Wishlist</Text>
			<FlatList
				horizontal
				showsHorizontalScrollIndicator={false}
				data={data?.items}
				renderItem={({ item }) => <WatchlistItem item={item} />}
				ListFooterComponent={<View style={{ width: 16 }} />}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	sectionHeader: {
		fontWeight: 'bold',
		color: '#505050',
		fontSize: 16,
		marginVertical: 8,
		marginLeft: 16
	}
});

export default Watchlist;
