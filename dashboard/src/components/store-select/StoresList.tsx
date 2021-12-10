import React from 'react';
import { Text, FlatList, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { updatePreference } from '../../redux/preferences/actions';
import { useManagedStoresQuery } from '../../types/api';
import { useAppSelector } from '../../redux/store';

const StoresList = () => {
	const dispatch = useDispatch();

	const userId = useAppSelector(({ auth }) => auth.userId);
	const [{ data }] = useManagedStoresQuery({
		variables: { userId: userId as string }
	});
	const stores = data?.user.managed.map(({ store }) => store);

	const handleStoreSelect = (storeId: string) => {
		dispatch(updatePreference({ activeStore: storeId }));
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
