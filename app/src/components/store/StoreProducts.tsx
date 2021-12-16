import React from 'react';
import { View, FlatList } from 'react-native';
import { StoreQuery, useStoreProductsQuery } from '../../types/api';
import StoreHeader from './StoreHeader';
import StoreListItem from './StoreListItem';

interface StoreProductsProps {
	store: StoreQuery['store'];
}

const StoreProducts: React.FC<StoreProductsProps> = ({ store }) => {
	const [{ data, fetching }] = useStoreProductsQuery({
		variables: { storeId: store.id }
	});

	if (fetching || !data?.store.products) return <View />;

	return (
		<FlatList
			data={data.store.products}
			keyExtractor={({ id }) => id}
			ListHeaderComponent={() => <StoreHeader store={store} />}
			showsVerticalScrollIndicator={false}
			renderItem={({ item }) => <StoreListItem item={item} />}
			numColumns={2}
		/>
	);
};

export default StoreProducts;
