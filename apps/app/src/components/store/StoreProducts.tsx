import React from 'react';
import { Pressable, RefreshControl, View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { CustomImage, Spacer, Typography, useTheme } from '@habiti/components';
import { FlashList } from '@shopify/flash-list';
import { formatNaira } from '@habiti/common';

import ViewCart from './ViewCart';

import { useStoreProductsQuery } from '../../data/queries';
import useDebounced from '../../hooks/useDebounced';
import useRefresh from '../../hooks/useRefresh';

import type { Product, Store } from '../../data/types';
import type { AppStackParamList } from '../../navigation/types';

interface StoreProductsProps {
	store: Store;
	activeCategory: string;
	searchTerm: string;
}

const buildFilter = ({
	searchTerm,
	activeCategory
}: {
	searchTerm: string;
	activeCategory: string;
}) => {
	const filters = new URLSearchParams();

	if (searchTerm) {
		filters.set('search', searchTerm);
	}

	if (activeCategory) {
		filters.set('categoryId', activeCategory);
	}

	return filters;
};

const StoreProducts: React.FC<StoreProductsProps> = ({
	store,
	activeCategory,
	searchTerm
}) => {
	const debouncedSearchTerm = useDebounced(searchTerm, 300);
	const filter = buildFilter({
		searchTerm: debouncedSearchTerm,
		activeCategory
	});

	const { data, isLoading, refetch, error } = useStoreProductsQuery(
		store.id,
		filter
	);
	const { refreshing, refresh } = useRefresh({ refetch });
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();
	const { theme } = useTheme();
	const { bottom } = useSafeAreaInsets();

	const products = data?.products;

	const handleProductPress = React.useCallback(
		(productId: string) => () => {
			navigate('Product', { productId });
		},
		[]
	);

	if (isLoading && !products) return <View />;

	return (
		<View style={{ flex: 1 }}>
			<FlashList
				keyboardShouldPersistTaps='handled'
				contentContainerStyle={{
					backgroundColor: theme.screen.background,
					paddingTop: 8
				}}
				data={products}
				keyExtractor={p => p.id}
				showsVerticalScrollIndicator={false}
				renderItem={({ item, index }) => (
					<StoreProductListItem
						item={item}
						onPress={handleProductPress(item.id)}
						side={index % 2 === 0 ? 'left' : 'right'}
					/>
				)}
				numColumns={2}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={refresh}
						tintColor={theme.text.secondary}
					/>
				}
				ListFooterComponent={() => <Spacer y={bottom} />}
			/>
			<ViewCart
				cartId={store.userCart?.id}
				count={store.userCart?.products.length}
			/>
		</View>
	);
};

interface StoreListItemProps {
	item: Product;
	onPress(): void;
	side: 'left' | 'right';
}

export const StoreProductListItem: React.FC<StoreListItemProps> = ({
	item,
	onPress,
	side
}) => (
	<Pressable
		key={item.id}
		style={[
			styles.pressable,
			{ [side === 'left' ? 'marginLeft' : 'marginRight']: 16 }
		]}
		onPress={onPress}
	>
		<CustomImage height={200} uri={item.images[0]?.path} />
		<Spacer y={8} />
		<Typography weight='medium'>{item.name}</Typography>
		<Spacer y={2} />
		<Typography variant='secondary'>{formatNaira(item.unitPrice)}</Typography>
	</Pressable>
);

const styles = StyleSheet.create({
	pressable: {
		flex: 1,
		margin: 8
	}
});

export default StoreProducts;
