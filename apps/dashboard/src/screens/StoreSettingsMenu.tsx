import React from 'react';

import { Screen } from '@habiti/components';

import StoreMenuRow from '../components/store/StoreMenuRow';

import type {
	StoreStackParamList,
	StoreStackScreenProps
} from '../navigation/types';

type ParamlessStoreRoute = {
	[K in keyof StoreStackParamList]: StoreStackParamList[K] extends undefined
		? K
		: never;
}[keyof StoreStackParamList];

const StoreSettingsMenu: React.FC<StoreStackScreenProps<'StoreSettings'>> = ({
	navigation
}) => {
	const handleNavigate = React.useCallback(
		(screen: ParamlessStoreRoute) => () => {
			navigation.navigate(screen);
		},
		[navigation]
	);

	return (
		<Screen>
			<StoreMenuRow title='Edit Store' onPress={handleNavigate('Edit Store')} />
			<StoreMenuRow title='Categories' onPress={handleNavigate('Categories')} />
			<StoreMenuRow title='Addresses' onPress={handleNavigate('Addresses')} />
			<StoreMenuRow
				title='Delete Store'
				onPress={handleNavigate('DeleteStore')}
			/>
		</Screen>
	);
};

export default StoreSettingsMenu;
