import { SectionHeader, useTheme } from '@habiti/components';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, StyleSheet } from 'react-native';

const QuickActions = () => {
	const { theme } = useTheme();
	const { navigate } = useNavigation();

	// return (
	//   <View style={styles.container}>
	//     <SectionHeader title="Quick Actions" />
	//     <View style={styles.actionsGrid}>
	//       <ActionButton
	//         icon="tag"
	//         label="Add Product"
	//         onPress={() => navigate('Add Product')}
	//       />
	//       <ActionButton
	//         icon="dollar-sign"
	//         label="New Payout"
	//         onPress={() => navigate('AddPayout')}
	//       />
	//       <ActionButton
	//         icon="edit"
	//         label="Edit Store"
	//         onPress={() => navigate('Edit Store')}
	//       />
	//       <ActionButton
	//         icon="folder"
	//         label="Categories"
	//         onPress={() => navigate('Categories')}
	//       />
	//     </View>
	//   </View>
	// );

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
