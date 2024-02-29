import { ListEmpty } from '@market/components';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import WatchlistProduct from './WatchlistProduct';
import textStyles from '../../styles/text';
import { HomeQuery } from '../../types/api';
import { HomeTabParamList, AppStackParamList } from '../../types/navigation';

interface WatchlistProps {
	watchlist: HomeQuery['currentUser']['watchlist'];
}

const Watchlist: React.FC<WatchlistProps> = ({ watchlist }) => {
	const { navigate } = useNavigation<NavigationProp<HomeTabParamList>>();
	const navigation = useNavigation<NavigationProp<AppStackParamList>>();

	const products = watchlist.map(({ product }) => product);

	const handleProductPress = (productId: string) => () => {
		navigation.navigate('Product', { productId });
	};

	if (!products || products?.length === 0) {
		return (
			<View style={styles.container}>
				<Text style={[textStyles.sectionHeader, { marginLeft: 16 }]}>
					Watchlist
				</Text>
				<ListEmpty
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
			<FlashList
				horizontal
				showsHorizontalScrollIndicator={false}
				data={products}
				renderItem={({ item }) => (
					<WatchlistProduct
						product={item}
						onPress={handleProductPress(item.id)}
					/>
				)}
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
