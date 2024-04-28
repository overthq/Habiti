import { Icon, SectionHeader, Typography, useTheme } from '@market/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';

import { MainTabParamList } from '../../types/navigation';

const QuickActions = () => {
	const { navigate } = useNavigation<NavigationProp<MainTabParamList>>();
	const { theme } = useTheme();

	return (
		<View style={styles.container}>
			<SectionHeader title='Quick actions' />
			<View
				style={{
					backgroundColor: theme.input.background,
					paddingHorizontal: 16
				}}
			>
				<Pressable style={styles.row} onPress={() => navigate('Orders')}>
					<Typography>5 orders to fulfill</Typography>
					<Icon name='chevron-right' />
				</Pressable>
				<Pressable style={styles.row} onPress={() => navigate('Products')}>
					<Typography>10 low-stock products</Typography>
					<Icon name='chevron-right' />
				</Pressable>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginTop: 16
	},
	label: {
		marginBottom: 4
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 8
	}
});

export default QuickActions;
