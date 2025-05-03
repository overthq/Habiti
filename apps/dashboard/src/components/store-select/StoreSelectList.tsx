import React from 'react';
import { FlatList, ListRenderItem, View } from 'react-native';

import StoreSelectListItem from './StoreSelectListItem';
import useStore from '../../state';
import { ManagedStoresQuery } from '../../types/api';
import { useShallow } from 'zustand/react/shallow';

interface StoreSelectListProps {
	stores: ManagedStoresQuery['currentUser']['managed'][number]['store'][];
}

const StoreSelectList: React.FC<StoreSelectListProps> = ({ stores }) => {
	const { setPreference, activeStore } = useStore(
		useShallow(state => ({
			setPreference: state.setPreference,
			activeStore: state.activeStore
		}))
	);

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
		<View style={{ flex: 1 }}>
			<FlatList
				data={stores}
				keyExtractor={store => store.id}
				renderItem={renderStore}
				horizontal
				showsHorizontalScrollIndicator={false}
			/>
		</View>
	);
};

export default StoreSelectList;
