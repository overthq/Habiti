import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SectionHeader } from '@habiti/components';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';

import WatchlistProduct from './WatchlistProduct';
import { HomeQuery } from '../../types/api';
import { AppStackParamList } from '../../types/navigation';

// Consider not displaying anything when the watchlist is empty.

interface WatchlistProps {
	watchlist: HomeQuery['currentUser']['watchlist'];
}

const Watchlist: React.FC<WatchlistProps> = ({ watchlist }) => {
	return (
		<View style={styles.container}>
			<SectionHeader title='Watchlist' />
			<WatchlistMain watchlist={watchlist} />
		</View>
	);
};

interface WatchlistMainProps {
	watchlist: HomeQuery['currentUser']['watchlist'];
}

const WatchlistMain: React.FC<WatchlistMainProps> = ({ watchlist }) => {
	const navigation = useNavigation<NavigationProp<AppStackParamList>>();

	const products = watchlist.map(({ product }) => product);

	const handleProductPress = (productId: string) => () => {
		navigation.navigate('Product', { productId });
	};

	if (!products || products?.length === 0) {
		return null;
	}

	return (
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
	);
};

const styles = StyleSheet.create({
	container: {
		paddingTop: 16
	},
	sectionHeader: {
		marginVertical: 8,
		marginLeft: 16
	}
});

export default Watchlist;
