import React from 'react';
import { View } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import type { StoreStackParamList } from '../../types/navigation';
import StoreMenuRow from './StoreMenuRow';

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
			<StoreMenuRow
				title='Edit profile'
				onPress={handleNavigate('Edit Store')}
			/>
			<StoreMenuRow title='Payouts' onPress={handleNavigate('Payouts')} />
			<StoreMenuRow title='Managers' onPress={handleNavigate('Managers')} />
			<StoreMenuRow title='Categories' onPress={handleNavigate('Categories')} />
		</View>
	);
};

export default StoreMenu;
