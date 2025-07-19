import React from 'react';
import { RefreshControl, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Spacer, useTheme } from '@habiti/components';
import { FlashList } from '@shopify/flash-list';

import StoreListItem from './StoreListItem';
import { StoreQuery, useStoreProductsQuery } from '../../types/api';
import { AppStackParamList } from '../../types/navigation';
import useRefresh from '../../hooks/useRefresh';
import ViewCart from './ViewCart';

interface StoreProductsProps {
	store: StoreQuery['store'];
	activeCategory: string;
	searchTerm: string;
}

const StoreProducts: React.FC<StoreProductsProps> = ({
	store,
	activeCategory,
	searchTerm
}) => {
	const [{ data, fetching }, refetch] = useStoreProductsQuery({
		variables: {
			storeId: store.id,
			...(activeCategory && {
				filter: {
					categories: { some: { categoryId: { equals: activeCategory } } }
				}
			})
		}
	});
	const { refreshing, refresh } = useRefresh({ fetching, refetch });
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();
	const { theme } = useTheme();
	const { bottom } = useSafeAreaInsets();

	const products = data?.store.products;

	const handleProductPress = React.useCallback(
		(productId: string) => () => {
			navigate('Product', { productId });
		},
		[]
	);

	if (fetching && !products) return <View />;

	return (
		<View style={{ flex: 1, display: !searchTerm ? 'flex' : 'none' }}>
			<FlashList
				keyboardShouldPersistTaps='handled'
				contentContainerStyle={{
					backgroundColor: theme.screen.background,
					paddingTop: 8
				}}
				data={products.edges}
				keyExtractor={({ node }) => node.id}
				showsVerticalScrollIndicator={false}
				estimatedItemSize={240}
				renderItem={({ item, index }) => (
					<StoreListItem
						item={item.node}
						onPress={handleProductPress(item.node.id)}
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
