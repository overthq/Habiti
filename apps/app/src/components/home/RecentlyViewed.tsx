import React from 'react';
import { View, Pressable, FlatList } from 'react-native';
import {
	CustomImage,
	SectionHeader,
	Spacer,
	Typography
} from '@habiti/components';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { formatNaira } from '@habiti/common';

import {
	RecentlyViewedProduct,
	useRecentlyViewedStore
} from '../../state/recentlyViewed';
import { AppStackParamList } from '../../navigation/types';

const RecentlyViewed: React.FC = () => {
	const products = useRecentlyViewedStore(state => state.products);
	const navigation = useNavigation<NavigationProp<AppStackParamList>>();

	const handleProductPress = (productId: string) => () => {
		navigation.navigate('Product', { productId });
	};

	if (products.length === 0) return null;

	return (
		<View>
			<SectionHeader title='Recently viewed' padded={false} />

			<Spacer y={8} />

			<FlatList
				style={{ marginHorizontal: -16 }}
				horizontal
				showsHorizontalScrollIndicator={false}
				data={products}
				contentContainerStyle={{
					flexGrow: 1,
					gap: 12,
					paddingHorizontal: 16
				}}
				renderItem={({ item }) => (
					<RecentlyViewedItem
						product={item}
						onPress={handleProductPress(item.id)}
					/>
				)}
			/>
		</View>
	);
};

interface RecentlyViewedItemProps {
	product: RecentlyViewedProduct;
	onPress(): void;
}

const RecentlyViewedItem: React.FC<RecentlyViewedItemProps> = ({
	product,
	onPress
}) => {
	return (
		<Pressable onPress={onPress}>
			<CustomImage uri={product.image ?? undefined} width={160} height={160} />

			<Spacer y={8} />

			<Typography size='small' weight='medium' numberOfLines={1}>
				{product.name}
			</Typography>

			<Typography size='small' variant='secondary'>
				{formatNaira(product.unitPrice)}
			</Typography>
		</Pressable>
	);
};

export default RecentlyViewed;
