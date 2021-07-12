import React from 'react';
import { FlatList } from 'react-native';
import { useStoreItemsQuery } from '../../types/api';
import StoreListItem from './StoreListItem';

interface StoreItemsProps {
	storeId: string;
	header: React.FC;
}

const StoreItems: React.FC<StoreItemsProps> = ({ storeId, header }) => {
	const [{ data }] = useStoreItemsQuery({
		variables: { storeId }
	});

	if (!data?.items) throw new Error('No store items');

	return (
		<FlatList
			data={data.items}
			keyExtractor={({ id }) => id}
			ListHeaderComponent={header}
			showsVerticalScrollIndicator={false}
			renderItem={({ item }) => <StoreListItem item={item} />}
			numColumns={2}
		/>
	);
};

export default StoreItems;
