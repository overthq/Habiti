import { Button } from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';

import StoreMenuRow from './StoreMenuRow';
import useStore from '../../state';
import type { StoreStackParamList } from '../../types/navigation';

const StoreMenu = () => {
	const { navigate } = useNavigation<NavigationProp<StoreStackParamList>>();
	const { logOut } = useStore();

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
			{/* <StoreMenuRow title='Managers' onPress={handleNavigate('Managers')} /> */}
			<StoreMenuRow title='Categories' onPress={handleNavigate('Categories')} />
			<StoreMenuRow title='Settings' onPress={handleNavigate('Settings')} />
			<StoreMenuRow title='Appearance' onPress={handleNavigate('Appearance')} />

			<View style={{ padding: 16 }}>
				<Button text='Logout' onPress={logOut} />
			</View>
		</View>
	);
};

export default StoreMenu;
