import { useTheme } from '@habiti/components';
import {
	useNavigation,
	NavigationProp,
	useRoute,
	RouteProp
} from '@react-navigation/native';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import React from 'react';
import { RefreshControl } from 'react-native';

import ProductsListItem from './ProductsListItem';
import { ProductsQuery, useProductsQuery } from '../../types/api';
import {
	MainTabParamList,
	ProductsStackParamList
} from '../../types/navigation';

const ProductList: React.FC = () => {
	const { params } = useRoute<RouteProp<MainTabParamList, 'Products'>>();
	const { navigate } = useNavigation<NavigationProp<ProductsStackParamList>>();
	const [{ fetching, data }, refetch] = useProductsQuery({
		variables: params
	});
	const [refreshing, setRefreshing] = React.useState(false);
	const { theme } = useTheme();

	React.useEffect(() => {
		if (!fetching && refreshing) {
			setRefreshing(false);
		}
	}, [fetching, refreshing]);

	const handleRefresh = () => {
		setRefreshing(true);
		refetch();
	};

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
		<FlashList
			keyExtractor={i => i.node.id}
			data={data?.currentStore.products.edges}
			renderItem={renderProduct}
			estimatedItemSize={60}
			refreshControl={
				<RefreshControl
					refreshing={fetching}
					onRefresh={handleRefresh}
					tintColor={theme.text.secondary}
				/>
			}
		/>
	);
};

export default ProductList;
