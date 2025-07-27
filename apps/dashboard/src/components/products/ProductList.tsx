import React from 'react';
import { View, RefreshControl } from 'react-native';
import { useTheme } from '@habiti/components';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import ProductsListItem from './ProductsListItem';
import { ProductsQuery } from '../../types/api';
import { ProductsStackParamList } from '../../types/navigation';
import { useProductsContext } from './ProductsContext';

const ProductList: React.FC = () => {
	const { navigate } = useNavigation<NavigationProp<ProductsStackParamList>>();
	const { theme } = useTheme();
	const { data, refreshing, refresh } = useProductsContext();
	const [editMode, setEditMode] = React.useState(false);
	const [selectedProducts, setSelectedProducts] = React.useState<string[]>([]);

	const handlePress = React.useCallback(
		(productId: string) => () =>
			navigate('Product', { screen: 'Product.Main', params: { productId } }),
		[]
	);

	const handleLongPress = React.useCallback(
		(productId: string) => () => {
			setEditMode(true);
			setSelectedProducts(prev =>
				prev.includes(productId) ? prev : [...prev, productId]
			);
		},
		[]
	);

	const clearSelectedProducts = React.useCallback(() => {
		setEditMode(false);
		setSelectedProducts([]);
	}, []);

	const renderProduct: ListRenderItem<
		ProductsQuery['currentStore']['products']['edges'][number]
	> = React.useCallback(({ item }) => {
		return (
			<ProductsListItem
				product={item.node}
				onPress={handlePress(item.node.id)}
				onLongPress={handleLongPress(item.node.id)}
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
