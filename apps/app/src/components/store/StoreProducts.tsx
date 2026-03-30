import React from 'react';
import { RefreshControl, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Spacer, useTheme } from '@habiti/components';
import { FlashList } from '@shopify/flash-list';

import StoreListItem from './StoreListItem';
import ViewCart from './ViewCart';

import { useStoreProductsQuery } from '../../data/queries';
import type { Store } from '../../data/types';
import { AppStackParamList } from '../../types/navigation';
import useRefresh from '../../hooks/useRefresh';

interface StoreProductsProps {
	store: Store;
	activeCategory: string;
	searchTerm: string;
}

const StoreProducts: React.FC<StoreProductsProps> = ({
	store,
	activeCategory,
	searchTerm
}) => {
	const filter = activeCategory
		? { categories: { some: { categoryId: { equals: activeCategory } } } }
		: undefined;
	const { data, isLoading, refetch } = useStoreProductsQuery(store.id, filter);
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
		<View style={{ flex: 1, display: !searchTerm ? 'flex' : 'none' }}>
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
					<StoreListItem
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

export default StoreProducts;
