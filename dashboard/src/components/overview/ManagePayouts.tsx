import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useStoreQuery } from '../../types/api';
import { HomeStackParamList } from '../../types/navigation';
import { formatNaira } from '../../utils/currency';
import Button from '../global/Button';
import Typography from '../global/Typography';
import useTheme from '../../hooks/useTheme';

const ManagePayouts = () => {
	const [{ data }] = useStoreQuery();
	const { navigate } = useNavigation<NavigationProp<HomeStackParamList>>();
	const { theme } = useTheme();

	const navigateToPayouts = React.useCallback(() => {
		navigate('Payouts');
	}, []);

	return (
		<View style={[styles.container, { backgroundColor: '#505050' }]}>
			<Typography variant='label' style={{ fontWeight: '500' }}>
				Payouts
			</Typography>
			<Typography size='xxlarge' weight='medium' style={styles.amount}>
				{formatNaira(data?.currentStore.realizedRevenue ?? 0)}
			</Typography>
			<Button text='Manage payouts' onPress={navigateToPayouts} />
		</View>
	);
};

const { width } = Dimensions.get('screen');

const styles = StyleSheet.create({
	container: {
		marginLeft: 16,
		padding: 8,
		borderRadius: 4,
		width: width / 2 - 32
	},
	amount: {
		marginBottom: 8
	}
});

export default ManagePayouts;
