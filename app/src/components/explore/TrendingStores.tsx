import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import ListEmpty from '../global/ListEmpty';
import { stores } from '../../api';
import TrendingStoresItem from './TrendingStoresItem';

const TrendingStores: React.FC = () => {
	return (
		<View style={styles.container}>
			<Text style={styles.sectionHeader}>Trending Stores</Text>
			<FlatList
				horizontal
				data={stores}
				keyExtractor={({ id }) => id}
				contentContainerStyle={styles.list}
				renderItem={({ item }) => <TrendingStoresItem store={item} />}
				// ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
				ListEmptyComponent={
					<ListEmpty
						title='No trending stores'
						description='There are no stores trending currently.'
					/>
				}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginTop: 8
	},
	list: {
		paddingLeft: 20,
		height: 95
	},
	sectionHeader: {
		marginVertical: 5,
		fontSize: 16,
		fontWeight: '500',
		color: '#505050',
		paddingLeft: 20
	}
});

export default TrendingStores;
