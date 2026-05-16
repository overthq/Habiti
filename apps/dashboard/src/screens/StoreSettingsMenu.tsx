import React from 'react';

import { Screen } from '@habiti/components';

import StoreMenuRow from '../components/store/StoreMenuRow';

import { NavigationProp, useNavigation } from '@react-navigation/native';
import type { StoreStackParamList } from '../navigation/types';

const StoreSettingsMenu = () => {
	const { navigate } = useNavigation<NavigationProp<StoreStackParamList>>();

	const handleNavigate = React.useCallback(
		(screen: keyof StoreStackParamList) => () => {
			navigate(screen);
		},
		[]
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
