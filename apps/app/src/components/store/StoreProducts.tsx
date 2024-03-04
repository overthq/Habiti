import { useNavigation, NavigationProp } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { ScrollViewProps, View } from 'react-native';

import StoreHeader from './StoreHeader';
import StoreListItem from './StoreListItem';
import { StoreQuery, useStoreProductsQuery } from '../../types/api';
import { AppStackParamList } from '../../types/navigation';

interface StoreProductsProps {
	store: StoreQuery['store'];
}

const StoreProducts: React.FC<StoreProductsProps> = ({ store }) => {
	const [{ data, fetching }] = useStoreProductsQuery({
		variables: { storeId: store.id }
	});
	const { navigate, setOptions } =
		useNavigation<NavigationProp<AppStackParamList>>();
	const [headerVisible, setHeaderVisible] = React.useState(false);

	const products = data?.store.products;

	const handleProductPress = React.useCallback(
		(productId: string) => () => {
			navigate('Product', { productId });
		},
		[]
	);

	const handleScroll = React.useCallback<
		NonNullable<ScrollViewProps['onScroll']>
	>(
		({ nativeEvent }) => {
			if (data?.store.name) {
				if (nativeEvent.contentOffset.y >= 100 && !headerVisible) {
					setHeaderVisible(true);
					setOptions({ headerTitle: data.store.name });
				} else if (nativeEvent.contentOffset.y < 100 && headerVisible) {
					setHeaderVisible(false);
					setOptions({ headerTitle: '' });
				}
			}
		},
		[data?.store.name, headerVisible]
	);

	if (fetching || !products) return <View />;

	return (
		<FlashList
			data={products}
			keyExtractor={({ id }) => id}
			showsVerticalScrollIndicator={false}
			estimatedItemSize={240}
			renderItem={({ item }) => (
				<StoreListItem item={item} onPress={handleProductPress(item.id)} />
			)}
			numColumns={2}
			onScroll={handleScroll}
			style={{ paddingHorizontal: 8 }}
			ListHeaderComponent={() => <StoreHeader store={store} />}
		/>
	);
};

export default StoreProducts;
