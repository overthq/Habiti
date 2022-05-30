import React from 'react';
import { Text, FlatList, TouchableOpacity } from 'react-native';
import { useManagedStoresQuery } from '../../types/api';
import useStore from '../../state';

const StoresList = () => {
	const { userId, setPreference } = useStore(state => ({
		userId: state.userId,
		setPreference: state.setPreference
	}));

	const [{ data }] = useManagedStoresQuery({
		variables: { userId: userId as string }
	});

	const stores = data?.user.managed.map(({ store }) => store);

	const handleStoreSelect = (storeId: string) => {
		setPreference({ activeStore: storeId });
	};

	return (
		<FlatList
			horizontal
			data={stores}
			renderItem={({ item }) => (
				<TouchableOpacity onPress={() => handleStoreSelect(item.id)}>
					<Text>{item.name}</Text>
				</TouchableOpacity>
			)}
		/>
	);
};

export default StoresList;
