import React from 'react';
import { FlatList } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import ProductsListItem from './ProductsListItem';
import ProductGridItem from './ProductGridItem';
import { useProductsQuery } from '../../types/api';
import useStore from '../../state';
import { ProductsStackParamList } from '../../types/navigation';

interface ProductListProps {
	mode: 'list' | 'grid';
}

const ProductList: React.FC<ProductListProps> = ({ mode }) => {
	const activeStore = useStore(state => state.activeStore);
	const [{ data }] = useProductsQuery({
		variables: { storeId: activeStore as string }
	});
	const { navigate } = useNavigation<NavigationProp<ProductsStackParamList>>();

	// Not sure if I should be rendering a new list when
	// we change the "mode", but we'll see.

	const handlePress = React.useCallback(
		(productId: string) => () => navigate('Product', { productId }),
		[]
	);

	return mode === 'list' ? (
		<FlatList
			keyExtractor={i => i.id}
			data={data?.store.products}
			renderItem={({ item }) => (
				<ProductsListItem product={item} onPress={handlePress(item.id)} />
			)}
		/>
	) : (
		<FlashList
			numColumns={2}
			data={data?.store.products}
			renderItem={({ item }) => (
				<ProductGridItem product={item} onPress={handlePress(item.id)} />
			)}
		/>
	);
};

export default ProductList;
