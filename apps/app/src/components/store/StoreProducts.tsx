import { useTheme } from '@habiti/components';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { RefreshControl, ScrollViewProps, View } from 'react-native';

import StoreHeader from './StoreHeader';
import StoreListItem from './StoreListItem';
import { StoreQuery, useStoreProductsQuery } from '../../types/api';
import { AppStackParamList } from '../../types/navigation';

interface StoreProductsProps {
	store: StoreQuery['store'];
}

const StoreProducts: React.FC<StoreProductsProps> = ({ store }) => {
	const [{ data, fetching }, refetch] = useStoreProductsQuery({
		variables: { storeId: store.id }
	});
	const { navigate, setOptions } =
		useNavigation<NavigationProp<AppStackParamList>>();
	const [headerVisible, setHeaderVisible] = React.useState(false);
	const { theme } = useTheme();
	const [refreshing, setRefreshing] = React.useState(false);

	const handleRefresh = React.useCallback(() => {
		setRefreshing(true);
		refetch();
	}, [refetch]);

	React.useEffect(() => {
		if (!fetching && refreshing) setRefreshing(false);
	}, [fetching, refreshing]);

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
			renderItem={({ item, index }) => (
				<StoreListItem
					item={item}
					onPress={handleProductPress(item.id)}
					side={index % 2 === 0 ? 'left' : 'right'}
				/>
			)}
			numColumns={2}
			onScroll={handleScroll}
			ListHeaderComponent={<StoreHeader store={store} />}
			refreshControl={
				<RefreshControl
					refreshing={refreshing}
					onRefresh={handleRefresh}
					tintColor={theme.text.secondary}
				/>
			}
		/>
	);
};

export default StoreProducts;
