import { Icon, Typography } from '@market/components';
import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';

interface OverviewActionsProps {
	pendingOrderCount: number;
	lowStockCount: number;
}

const OverviewActions: React.FC<OverviewActionsProps> = ({
	pendingOrderCount,
	lowStockCount
}) => {
	return (
		<View style={styles.container}>
			<Pressable style={styles.row}>
				<View style={styles.left}>
					<Icon name='inbox' size={20} />
					<Text style={styles.text}>
						You have {pendingOrderCount} pending orders
					</Text>
				</View>
				<Icon name='chevron-right' size={20} />
			</Pressable>
			<Pressable style={styles.row}>
				<View style={styles.left}>
					<Icon name='tag' size={20} />
					<Typography style={styles.text}>
						{lowStockCount} products are running low
					</Typography>
				</View>
				<Icon name='chevron-right' size={20} />
			</Pressable>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginVertical: 8
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		paddingVertical: 2
	},
	left: {
		flexDirection: 'row'
	},
	text: {
		marginLeft: 8
	}
});

export default OverviewActions;
