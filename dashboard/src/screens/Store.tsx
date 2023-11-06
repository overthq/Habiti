import React from 'react';
import { View } from 'react-native';
import { useStoreQuery } from '../types/api';
import StoreProfile from '../components/store/StoreProfile';
import StoreMenu from '../components/store/StoreMenu';
import Screen from '../components/global/Screen';

const Store: React.FC = () => {
	const [{ data, fetching }] = useStoreQuery();
	const store = data?.currentStore;

	if (fetching || !store) {
		return <View />;
	}

	return (
		<Screen>
			<StoreProfile store={store} />
			<StoreMenu />
		</Screen>
	);
};

export default Store;
