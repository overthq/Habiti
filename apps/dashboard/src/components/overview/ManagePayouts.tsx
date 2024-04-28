import { Icon, SectionHeader, Typography, useTheme } from '@market/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';

import { useStoreQuery } from '../../types/api';
import { HomeStackParamList } from '../../types/navigation';
import { formatNaira } from '../../utils/currency';

const ManagePayouts = () => {
	const [{ data }] = useStoreQuery();
	const { navigate } = useNavigation<NavigationProp<HomeStackParamList>>();
	const { theme } = useTheme();

	const navigateToPayouts = React.useCallback(() => {
		navigate('Payouts');
	}, []);

	return (
		<View>
			<SectionHeader title='Available Revenue' />
			<View style={{ paddingHorizontal: 16 }}>
				<Pressable style={styles.amount} onPress={navigateToPayouts}>
					<Typography size='xxxlarge' weight='bold'>
						{formatNaira(50000)}
						{/* {formatNaira(data?.currentStore.realizedRevenue ?? 0)} */}
					</Typography>
					<Icon name='chevron-right' color={theme.text.secondary} />
				</Pressable>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	amount: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 8
	}
});

export default ManagePayouts;
