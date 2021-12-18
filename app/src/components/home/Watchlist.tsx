import React from 'react';
import {
	View,
	Text,
	FlatList,
	StyleSheet,
	ActivityIndicator
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import WatchlistProduct from './WatchlistProduct';
import ListEmpty from '../global/ListEmpty';
import { useWatchlistQuery } from '../../types/api';
import { HomeTabParamList } from '../../types/navigation';
import textStyles from '../../styles/text';

const Watchlist = () => {
	const [{ data, fetching }] = useWatchlistQuery();
	const { navigate } = useNavigation<NavigationProp<HomeTabParamList>>();

	if (fetching) {
		return (
			<View>
				<ActivityIndicator />
			</View>
		);
	}

	const products = data?.currentUser.watchlist.map(({ product }) => product);

	if (!products || products?.length === 0) {
		return (
			<View style={styles.container}>
				<Text style={[textStyles.sectionHeader, { marginLeft: 16 }]}>
					Watchlist
				</Text>
				<ListEmpty
					title='Watchlist empty'
					description={`When you add items to your watchlist, you'll see them here.`}
					cta={{
						text: 'View trending',
						action: () => navigate('Explore')
					}}
				/>
			</View>
		);
	}

	return (
		<View>
			<Text style={[textStyles.sectionHeader, { marginLeft: 16 }]}>
				Watchlist
			</Text>
			<FlatList
				horizontal
				showsHorizontalScrollIndicator={false}
				data={products}
				renderItem={({ item }) => <WatchlistProduct product={item} />}
				ListFooterComponent={<View style={{ width: 16 }} />}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		height: 250
	},
	sectionHeader: {
		fontWeight: 'bold',
		color: '#505050',
		fontSize: 16,
		marginVertical: 8,
		marginLeft: 16
	}
});

export default Watchlist;
