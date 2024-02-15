import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import Typography from '../global/Typography';
import { Icon } from '../Icon';
import { MainTabParamList } from '../../types/navigation';

const QuickActions = () => {
	const { navigate } = useNavigation<NavigationProp<MainTabParamList>>();

	return (
		<View style={styles.container}>
			<Typography variant='label' weight='medium' style={styles.label}>
				Quick actions
			</Typography>
			<Pressable style={styles.row} onPress={() => navigate('Orders')}>
				<Typography>5 orders to fulfill</Typography>
				<Icon name='chevron-right' />
			</Pressable>
			<Pressable style={styles.row} onPress={() => navigate('Products')}>
				<Typography>10 low-stock products</Typography>
				<Icon name='chevron-right' />
			</Pressable>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginTop: 16,
		paddingHorizontal: 16
	},
	label: {
		marginBottom: 4
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 4
	}
});

export default QuickActions;
