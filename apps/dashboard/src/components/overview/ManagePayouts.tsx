import { formatNairaAbbreviated } from '@habiti/common';
import { Icon, SectionHeader, Typography, useTheme } from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';

import { HomeStackParamList } from '../../types/navigation';

interface ManagePayoutsProps {
	realizedRevenue: number;
}

const ManagePayouts: React.FC<ManagePayoutsProps> = ({ realizedRevenue }) => {
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
						{formatNairaAbbreviated(realizedRevenue)}
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
