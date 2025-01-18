import { Screen, ScreenHeader } from '@habiti/components';
import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import StoreMenu from '../components/store/StoreMenu';
import { useStoreQuery } from '../types/api';

const Store: React.FC = () => {
	const [{ data, fetching }] = useStoreQuery();
	const store = data?.currentStore;
	const { top } = useSafeAreaInsets();

	if (fetching || !store) {
		return <View />;
	}

	return (
		<Screen style={{ paddingTop: top }}>
			<ScreenHeader title='Store' />
			<StoreMenu store={store} />
		</Screen>
	);
};

export default Store;
