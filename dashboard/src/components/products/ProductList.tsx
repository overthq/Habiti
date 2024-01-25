import React from 'react';
import { View } from 'react-native';
import {
	useNavigation,
	NavigationProp,
	useRoute,
	RouteProp
} from '@react-navigation/native';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import ProductsListItem from './ProductsListItem';
import ProductGridItem from './ProductGridItem';
import { ProductsQuery, useProductsQuery } from '../../types/api';
import {
	MainTabParamList,
	ProductsStackParamList
} from '../../types/navigation';

interface ProductListProps {
	mode: 'list' | 'grid';
}

// TODO: Investigate performance around using two separate components for
// each mode versus one.

const ProductListHeader = <View style={{ height: 4 }} />;

const ProductList: React.FC<ProductListProps> = ({ mode }) => {
	const { params } = useRoute<RouteProp<MainTabParamList, 'Products'>>();
	const { navigate } = useNavigation<NavigationProp<ProductsStackParamList>>();
	const [{ data }] = useProductsQuery({ variables: params });

	const handlePress = React.useCallback(
		(productId: string) => () => navigate('Product', { productId }),
		[]
	);

	const renderProduct: ListRenderItem<
		ProductsQuery['currentStore']['products'][number]
	> = React.useCallback(({ item }) => {
		return <ProductsListItem product={item} onPress={handlePress(item.id)} />;
	}, []);

	return mode === 'list' ? (
		<FlashList
			keyExtractor={i => i.id}
			data={data?.currentStore.products}
			renderItem={renderProduct}
			ListHeaderComponent={ProductListHeader}
			estimatedItemSize={60}
		/>
	) : (
		<FlashList
			keyExtractor={i => i.id}
			numColumns={2}
			data={data?.currentStore.products}
			renderItem={({ item }) => (
				<ProductGridItem product={item} onPress={handlePress(item.id)} />
			)}
			estimatedItemSize={240}
		/>
	);
};

export default ProductList;
