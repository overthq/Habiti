import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
// import { useProductsQuery } from '../../types/api';
import WatchlistProduct from './WatchlistProduct';

const Watchlist = () => {
	// const [{ data, fetching }] = useItemsQuery();
	// TODO: Add a WatchlistProducts table to db.
	const [data, fetching] = [{ products: [] }, true];

	if (fetching) {
		return (
			<View>
				<Text>Loading...</Text>
			</View>
		);
	}

	return (
		<View>
			<Text style={styles.sectionHeader}>Wishlist</Text>
			<FlatList
				horizontal
				showsHorizontalScrollIndicator={false}
				data={data?.products}
				renderItem={({ item }) => <WatchlistProduct product={item} />}
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
