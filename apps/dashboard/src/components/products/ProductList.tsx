import React from 'react';
import { View, RefreshControl } from 'react-native';
import { useTheme } from '@habiti/components';
import {
	useNavigation,
	NavigationProp,
	useRoute,
	RouteProp
} from '@react-navigation/native';
import { FlashList, ListRenderItem } from '@shopify/flash-list';

import ProductsListItem from './ProductsListItem';
import { ProductsQuery, useProductsQuery } from '../../types/api';
import {
	MainTabParamList,
	ProductsStackParamList
} from '../../types/navigation';
import useRefresh from '../../hooks/useRefresh';

const ProductList: React.FC = () => {
	const { params } = useRoute<RouteProp<MainTabParamList, 'Products'>>();
	const { navigate } = useNavigation<NavigationProp<ProductsStackParamList>>();
	const [{ fetching, data }, refetch] = useProductsQuery({
		variables: params
	});
	const { refreshing, refresh } = useRefresh({ fetching, refetch });
	const { theme } = useTheme();

	const handlePress = React.useCallback(
		(productId: string) => () => navigate('Product', { productId }),
		[]
	);

	const renderProduct: ListRenderItem<
		ProductsQuery['currentStore']['products']['edges'][number]
	> = React.useCallback(({ item }) => {
		return (
			<ProductsListItem
				product={item.node}
				onPress={handlePress(item.node.id)}
			/>
		);
	}, []);

	return (
		<View style={{ flex: 1 }}>
			<FlashList
				keyExtractor={i => i.node.id}
				data={data?.currentStore.products.edges}
				renderItem={renderProduct}
				estimatedItemSize={60}
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

export default ProductList;
