import React from 'react';
import { View } from 'react-native';
import { Button, Screen, ScreenHeader } from '@habiti/components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import StoreMenu from '../components/store/StoreMenu';
import { useStoreQuery } from '../types/api';
import useStore from '../state';
import { useShallow } from 'zustand/react/shallow';

const Store: React.FC = () => {
	const [{ data, fetching, error }] = useStoreQuery();
	const { top } = useSafeAreaInsets();
	const { logOut } = useStore(useShallow(({ logOut }) => ({ logOut })));

	const store = data?.currentStore;

	if (fetching || !store) {
		return <View />;
	}

	if (error) {
		return (
			<View>
				<Button text='Log Out' onPress={logOut} />
			</View>
		);
	}

	return (
		<Screen style={{ paddingTop: top }}>
			<ScreenHeader title='Store' />
			<StoreMenu store={store} />
		</Screen>
	);
};

export default Store;
