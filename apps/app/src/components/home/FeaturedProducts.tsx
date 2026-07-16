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

import type { FeaturedProduct } from '../../data/types';
import type { AppStackParamList } from '../../navigation/types';

interface FeaturedProductsProps {
	products: FeaturedProduct[];
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ products }) => {
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();

	const handleProductPress = React.useCallback(
		(productId: string) => () => {
			navigate('Product', { productId });
		},
		[navigate]
	);

	if (products.length === 0) return null;

	return (
		<View>
			<SectionHeader title='Featured products' padded={false} />

			<Spacer y={8} />

			<FlatList
				style={{ marginHorizontal: -16 }}
				horizontal
				showsHorizontalScrollIndicator={false}
				data={products}
				keyExtractor={product => product.id}
				contentContainerStyle={{ flexGrow: 1, gap: 12, paddingHorizontal: 16 }}
				renderItem={({ item }) => (
					<FeaturedProductsItem
						product={item}
						onPress={handleProductPress(item.id)}
					/>
				)}
			/>
		</View>
	);
};

interface FeaturedProductsItemProps {
	product: FeaturedProduct;
	onPress(): void;
}

const FeaturedProductsItem: React.FC<FeaturedProductsItemProps> = ({
	product,
	onPress
}) => (
	<Pressable onPress={onPress} style={{ width: 160 }}>
		<CustomImage uri={product.images[0]?.path} width={160} height={160} />

		<Spacer y={8} />

		<Typography size='small' weight='medium' numberOfLines={1}>
			{product.name}
		</Typography>

		<Typography size='small' variant='secondary' numberOfLines={1}>
			{formatNaira(product.unitPrice)} · {product.store.name}
		</Typography>
	</Pressable>
);

export default FeaturedProducts;
