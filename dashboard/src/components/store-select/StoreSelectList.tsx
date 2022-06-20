import React from 'react';
import { FlatList } from 'react-native';
import { useManagedStoresQuery } from '../../types/api';
import useStore from '../../state';
import StoreSelectListItem from './StoreSelectListItem';

const StoreSelectList: React.FC = () => {
	const { userId, setPreference, activeStore } = useStore(state => ({
		userId: state.userId,
		setPreference: state.setPreference,
		activeStore: state.activeStore
	}));

	const [{ data }] = useManagedStoresQuery({
		variables: { userId: userId as string }
	});

	const stores = data?.user.managed.map(({ store }) => store);

	const handleStoreSelect = (storeId: string) => () => {
		setPreference({ activeStore: storeId });
	};

	return (
		<FlatList
			data={stores}
			keyExtractor={store => store.id}
			renderItem={({ item }) => (
				<StoreSelectListItem
					text={item.name}
					onPress={handleStoreSelect(item.id)}
					selected={item.id === activeStore}
				/>
			)}
		/>
	);
};

export default StoreSelectList;
