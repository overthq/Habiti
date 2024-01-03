import React from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { View, StyleSheet } from 'react-native';
import { useStoreQuery } from '../../types/api';
import { HomeStackParamList } from '../../types/navigation';
import { formatNaira } from '../../utils/currency';
import Button from '../global/Button';
import Typography from '../global/Typography';

const ManagePayouts = () => {
	const [{ data }] = useStoreQuery();
	const { navigate } = useNavigation<NavigationProp<HomeStackParamList>>();

	const navigateToPayouts = React.useCallback(() => {
		navigate('Payouts');
	}, []);

	return (
		<View style={styles.container}>
			<Typography variant='label' style={{ fontWeight: '500' }}>
				Payouts
			</Typography>
			<Typography style={{ fontSize: 24, fontWeight: '500', marginBottom: 8 }}>
				{formatNaira(data?.currentStore.realizedRevenue ?? 0)}
			</Typography>
			<Button text='Manage payouts' onPress={navigateToPayouts} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 16
	}
});

export default ManagePayouts;
