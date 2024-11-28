import { useTheme } from '@habiti/components';
import {
	useNavigation,
	NavigationProp,
	useRoute,
	RouteProp
} from '@react-navigation/native';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import React from 'react';
import { RefreshControl, View } from 'react-native';

import ProductsListItem from './ProductsListItem';
import { ProductsQuery, useProductsQuery } from '../../types/api';
import {
	MainTabParamList,
	ProductsStackParamList
} from '../../types/navigation';

const ProductListHeader = <View style={{}} />;

const ProductList: React.FC = () => {
	const { params } = useRoute<RouteProp<MainTabParamList, 'Products'>>();
	const { navigate } = useNavigation<NavigationProp<ProductsStackParamList>>();
	const [{ fetching, data }, refetch] = useProductsQuery({
		variables: params
	});
	const { theme } = useTheme();

	const handlePress = React.useCallback(
		(productId: string) => () => navigate('Product', { productId }),
		[]
	);

	const renderProduct: ListRenderItem<
		ProductsQuery['currentStore']['products'][number]
	> = React.useCallback(({ item }) => {
		return <ProductsListItem product={item} onPress={handlePress(item.id)} />;
	}, []);

	return (
		<FlashList
			keyExtractor={i => i.id}
			data={data?.currentStore.products}
			renderItem={renderProduct}
			ListHeaderComponent={ProductListHeader}
			estimatedItemSize={60}
			refreshControl={
				<RefreshControl
					refreshing={fetching}
					onRefresh={() => {
						refetch({ requestPolicy: 'network-only' });
					}}
					tintColor={theme.text.secondary}
				/>
			}
		/>
	);
};

export default ProductList;
