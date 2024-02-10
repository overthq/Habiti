import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Typography from '../global/Typography';
import { Icon } from '../Icon';

const QuickActions = () => {
	return (
		<View style={styles.container}>
			<Typography
				variant='label'
				size='large'
				weight='medium'
				style={styles.label}
			>
				Quick actions
			</Typography>
			<Pressable style={styles.row}>
				<Typography>5 orders to fulfill</Typography>
				<Icon name='chevron-right' />
			</Pressable>
			<Pressable style={styles.row}>
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
