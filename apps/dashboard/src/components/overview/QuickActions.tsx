import { SectionHeader, useTheme } from '@habiti/components';
import React from 'react';
import { View, StyleSheet } from 'react-native';

const QuickActions = () => {
	const { theme } = useTheme();

	return (
		<View style={styles.container}>
			<SectionHeader title='Quick actions' />
			<View
				style={{
					borderRadius: 6,
					backgroundColor: theme.input.background,
					marginTop: 4,
					marginHorizontal: 16,
					paddingLeft: 12,
					paddingRight: 10,
					height: 200
				}}
			>
				{/* <Pressable style={styles.row} onPress={() => navigate('Orders')}>
					<Typography>5 orders to fulfill</Typography>
					<Icon name='chevron-right' />
				</Pressable>
				<Pressable style={styles.row} onPress={() => navigate('Products')}>
					<Typography>10 low-stock products</Typography>
					<Icon name='chevron-right' />
				</Pressable> */}
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
		paddingVertical: 4
	}
});

export default QuickActions;
