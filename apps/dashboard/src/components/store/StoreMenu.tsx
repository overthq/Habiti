import React from 'react';
import { View } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';

import StoreMenuRow from './StoreMenuRow';
import type { StoreStackParamList } from '../../types/navigation';

const StoreMenu = () => {
	const { navigate } = useNavigation<NavigationProp<StoreStackParamList>>();

	const handleNavigate = React.useCallback(
		(screen: keyof StoreStackParamList) => () => {
			navigate(screen);
		},
		[]
	);

	return (
		<View>
			<StoreMenuRow title='Edit Store' onPress={handleNavigate('Edit Store')} />
			<StoreMenuRow title='Categories' onPress={handleNavigate('Categories')} />
			<StoreMenuRow title='Addresses' onPress={handleNavigate('Addresses')} />
			<StoreMenuRow title='Settings' onPress={handleNavigate('Settings')} />
		</View>
	);
};

export default StoreMenu;
