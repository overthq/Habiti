import React from 'react';
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

// TODO: Investigate performance around using two separate componenents for
// each mode versus one.

const ProductList: React.FC<ProductListProps> = ({ mode }) => {
	const activeStore = useStore(state => state.activeStore);
	const [{ data }] = useProductsQuery({
		variables: { storeId: activeStore as string }
	});
	const { navigate } = useNavigation<NavigationProp<ProductsStackParamList>>();

	const handlePress = React.useCallback(
		(productId: string) => () => navigate('Product', { productId }),
		[]
	);

	return mode === 'list' ? (
		<FlashList
			keyExtractor={i => i.id}
			data={data?.store.products}
			renderItem={({ item }) => (
				<ProductsListItem product={item} onPress={handlePress(item.id)} />
			)}
			estimatedItemSize={60}
		/>
	) : (
		<FlashList
			numColumns={2}
			data={data?.store.products}
			renderItem={({ item }) => (
				<ProductGridItem product={item} onPress={handlePress(item.id)} />
			)}
			estimatedItemSize={240}
		/>
	);
};

export default ProductList;
