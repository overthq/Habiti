import React from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Text, View } from 'react-native';
import { useStoreQuery } from '../../types/api';
import { HomeStackParamList } from '../../types/navigation';
import { formatNaira } from '../../utils/currency';
import Button from '../global/Button';

const ManagePayouts = () => {
	const [{ data }] = useStoreQuery();
	const { navigate } = useNavigation<NavigationProp<HomeStackParamList>>();

	const navigateToPayouts = React.useCallback(() => {
		navigate('Payouts');
	}, []);

	return (
		<View>
			<Text style={{ fontSize: 16, fontWeight: '500', color: '#505050' }}>
				Payouts
			</Text>
			<Text style={{ fontSize: 24, fontWeight: '500', marginBottom: 8 }}>
				{formatNaira(data?.currentStore.revenue ?? 0)}
			</Text>
			<Button text='Manage payouts' onPress={navigateToPayouts} />
		</View>
	);
};

export default ManagePayouts;
