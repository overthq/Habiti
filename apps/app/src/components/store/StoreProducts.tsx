import { useTheme } from '@habiti/components';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { RefreshControl, ScrollViewProps, View } from 'react-native';

import StoreHeader from './StoreHeader';
import StoreListItem from './StoreListItem';
import { StoreQuery, useStoreProductsQuery } from '../../types/api';
import { AppStackParamList } from '../../types/navigation';
import useRefresh from '../../hooks/useRefresh';

interface StoreProductsProps {
	store: StoreQuery['store'];
}

const StoreProducts: React.FC<StoreProductsProps> = ({ store }) => {
	const [activeCategory, setActiveCategory] = React.useState<string>();
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

	const products = data?.store.products;

	const handleProductPress = React.useCallback(
		(productId: string) => () => {
			navigate('Product', { productId });
		},
		[]
	);

	if (fetching && !products) return <View />;

	return (
		<View style={{ flex: 1 }}>
			<StoreHeader
				store={store}
				activeCategory={activeCategory}
				setActiveCategory={setActiveCategory}
			/>
			<FlashList
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
			/>
		</View>
	);
};

export default StoreProducts;
