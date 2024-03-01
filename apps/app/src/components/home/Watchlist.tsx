import { ListEmpty, Typography } from '@market/components';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { View, StyleSheet } from 'react-native';

import WatchlistProduct from './WatchlistProduct';
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
				<Typography
					variant='label'
					weight='medium'
					style={{ marginLeft: 16, marginBottom: 8 }}
				>
					Watchlist
				</Typography>
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
			<Typography
				variant='label'
				weight='bold'
				style={{ marginLeft: 16, marginBottom: 8 }}
			>
				Watchlist
			</Typography>
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
		marginVertical: 8,
		marginLeft: 16
	}
});

export default Watchlist;
