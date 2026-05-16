import React from 'react';
import { View, Pressable } from 'react-native';
import {
	CustomImage,
	SectionHeader,
	Spacer,
	Typography
} from '@habiti/components';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';

import type {
	WatchlistProduct as WatchlistProductType,
	Product
} from '../../data/types';
import { AppStackParamList } from '../../navigation/types';
import { formatNaira } from '@habiti/common';

interface WatchlistProps {
	watchlist: WatchlistProductType[];
}

const Watchlist: React.FC<WatchlistProps> = ({ watchlist }) => {
	const navigation = useNavigation<NavigationProp<AppStackParamList>>();

	const products = watchlist.map(({ product }) => product);

	const handleProductPress = (productId: string) => () => {
		navigation.navigate('Product', { productId });
	};

	if (!products || products?.length === 0) {
		return null;
	}

	return (
		<View>
			<SectionHeader title='Watchlist' />
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
		</View>
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
		<Pressable onPress={onPress}>
			<CustomImage uri={product.images[0]?.path} width={160} height={160} />

			<Spacer y={8} />

			<Typography weight='medium' numberOfLines={1}>
				{product.name}
			</Typography>

			<Typography variant='secondary'>
				{formatNaira(product.unitPrice)}
			</Typography>
		</Pressable>
	);
};

export default Watchlist;
