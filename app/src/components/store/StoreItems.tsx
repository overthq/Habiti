import React from 'react';
import { View, FlatList } from 'react-native';
import { useStoreItemsQuery } from '../../types/api';
import StoreHeader from './StoreHeader';
import StoreListItem from './StoreListItem';

interface StoreItemsProps {
	store: any; // FIXME
}

const StoreItems: React.FC<StoreItemsProps> = ({ store }) => {
	const [{ data, fetching }] = useStoreItemsQuery({
		variables: { storeId: store.id }
	});

	if (fetching) return <View />;
	if (!data?.items) return <View />;

	return (
		<FlatList
			data={data.items}
			keyExtractor={({ id }) => id}
			ListHeaderComponent={() => <StoreHeader store={store} />}
			showsVerticalScrollIndicator={false}
			renderItem={({ item }) => <StoreListItem item={item} />}
			numColumns={2}
		/>
	);
};

export default StoreItems;
