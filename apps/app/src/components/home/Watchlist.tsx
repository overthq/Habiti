import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { CustomImage, SectionHeader, Typography } from '@habiti/components';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';

import type {
	WatchlistProduct as WatchlistProductType,
	Product
} from '../../data/types';
import { AppStackParamList } from '../../navigation/types';
import { formatNaira } from '@habiti/common';

// Consider not displaying anything when the watchlist is empty.

interface WatchlistProps {
	watchlist: WatchlistProductType[];
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
	watchlist: WatchlistProductType[];
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
			contentContainerStyle={{ gap: 16 }}
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

interface WatchlistProductProps {
	onPress(): void;
	product: Product;
}

const WatchlistProduct: React.FC<WatchlistProductProps> = ({
	product,
	onPress
}) => {
	return (
		<Pressable style={styles.container} onPress={onPress}>
			<CustomImage
				uri={product.images[0]?.path}
				width={160}
				height={160}
				style={styles.image}
			/>
			<Typography weight='medium' numberOfLines={1}>
				{product.name}
			</Typography>
			<Typography variant='secondary'>
				{formatNaira(product.unitPrice)}
			</Typography>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingTop: 16
	},
	sectionHeader: {
		marginVertical: 8,
		marginLeft: 16
	},
	image: {
		marginBottom: 8
	}
});

export default Watchlist;
