import React from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { ManagedStoresQuery, useManagedStoresQuery } from '../../types/api';
import useStore from '../../state';
import StoreSelectListItem from './StoreSelectListItem';

const StoreSelectList: React.FC = () => {
	const { setPreference, activeStore } = useStore(state => ({
		setPreference: state.setPreference,
		activeStore: state.activeStore
	}));

	const [{ data }] = useManagedStoresQuery();

	const stores = data?.currentUser.managed.map(({ store }) => store);

	const handleStoreSelect = React.useCallback(
		(storeId: string) => () => {
			setPreference({ activeStore: storeId });
		},
		[]
	);

	const renderStore: ListRenderItem<
		ManagedStoresQuery['currentUser']['managed'][number]['store']
	> = React.useCallback(
		({ item }) => (
			<StoreSelectListItem
				text={item.name}
				onPress={handleStoreSelect(item.id)}
				selected={item.id === activeStore}
			/>
		),
		[]
	);

	return (
		<FlatList
			data={stores}
			keyExtractor={store => store.id}
			renderItem={renderStore}
		/>
	);
};

export default StoreSelectList;
