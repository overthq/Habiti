import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useStoreQuery } from '../../types/api';
import { HomeStackParamList } from '../../types/navigation';
import { formatNaira } from '../../utils/currency';
import Typography from '../global/Typography';
import { Icon } from '../Icon';

const ManagePayouts = () => {
	const [{ data }] = useStoreQuery();
	const { navigate } = useNavigation<NavigationProp<HomeStackParamList>>();

	const navigateToPayouts = React.useCallback(() => {
		navigate('Payouts');
	}, []);

	return (
		<View style={styles.container}>
			<Typography variant='label' weight='medium'>
				Available Revenue
			</Typography>
			<Pressable style={styles.amount} onPress={navigateToPayouts}>
				<Typography size='xxxlarge' weight='bold'>
					{formatNaira(data?.currentStore.realizedRevenue ?? 0)}
				</Typography>
				<Icon name='chevron-right' color='#D3D3D3' />
			</Pressable>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 16
	},
	amount: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 8
	}
});

export default ManagePayouts;
