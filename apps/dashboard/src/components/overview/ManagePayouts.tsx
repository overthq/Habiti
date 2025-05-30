import { formatNaira } from '@habiti/common';
import { Icon, SectionHeader, Typography, useTheme } from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';

import { useStoreQuery } from '../../types/api';
import { HomeStackParamList } from '../../types/navigation';

const ManagePayouts = () => {
	const [{ data }] = useStoreQuery();
	const { navigate } = useNavigation<NavigationProp<HomeStackParamList>>();
	const { theme } = useTheme();

	const navigateToPayouts = React.useCallback(() => {
		navigate('Payouts');
	}, []);

	return (
		<View style={styles.container}>
			<SectionHeader title='Available Revenue' />
			<View style={{ paddingHorizontal: 16 }}>
				<Pressable style={styles.amount} onPress={navigateToPayouts}>
					<Typography size='xxxlarge' weight='bold'>
						{formatNaira(data?.currentStore.realizedRevenue ?? 0)}
					</Typography>
					<Icon name='chevron-right' color={theme.text.secondary} />
				</Pressable>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingTop: 16
	},
	amount: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 8
	}
});

export default ManagePayouts;
