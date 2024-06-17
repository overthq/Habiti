import { Screen } from '@habiti/components';
import React from 'react';
import { View } from 'react-native';

import StoreMenu from '../components/store/StoreMenu';
import StoreProfile from '../components/store/StoreProfile';
import { useStoreQuery } from '../types/api';

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
