import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import textStyles from '../../styles/text';
import { useStoresQuery } from '../../types/api';
import ListEmpty from '../global/ListEmpty';
import TrendingStoresItem from './TrendingStoresItem';

const TrendingStores: React.FC = () => {
	const [{ data }] = useStoresQuery();

	return (
		<View style={styles.container}>
			<Text style={[textStyles.sectionHeader, { marginLeft: 16 }]}>
				Trending Stores
			</Text>
			<FlatList
				horizontal
				data={data?.stores}
				keyExtractor={({ id }) => id}
				contentContainerStyle={styles.list}
				renderItem={({ item }) => <TrendingStoresItem store={item} />}
				ListEmptyComponent={
					<ListEmpty
						title='No trending stores'
						description='There are no stores trending currently.'
					/>
				}
				showsHorizontalScrollIndicator={false}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {},
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
