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
			<Text>Payouts</Text>
			<Text>{formatNaira(data?.currentStore.revenue ?? 0)}</Text>
			<Button text='' onPress={navigateToPayouts} />
		</View>
	);
};

export default ManagePayouts;
