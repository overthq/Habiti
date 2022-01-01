import React from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
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
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();

	const products = data?.store.products;

	const handleProductPress = React.useCallback((productId: string) => {
		navigate('Product', { productId, storeId: store.id });
	}, []);

	if (fetching || !products)
		return (
			<View>
				<ActivityIndicator />
			</View>
		);

	return (
		<FlatList
			data={products}
			keyExtractor={({ id }) => id}
			ListHeaderComponent={() => <StoreHeader store={store} />}
			showsVerticalScrollIndicator={false}
			renderItem={({ item }) => (
				<StoreListItem
					item={item}
					onPress={() => handleProductPress(item.id)}
				/>
			)}
			numColumns={2}
		/>
	);
};

export default StoreProducts;
