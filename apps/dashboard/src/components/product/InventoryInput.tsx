import { useTheme, Icon, Typography } from '@habiti/components';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { View, Pressable, TextInput, StyleSheet } from 'react-native';

const InventoryInput = () => {
	const { theme } = useTheme();
	// const { setValue, getValues } = useFormContext();

	// const handleCounterPress = React.useCallback(
	// 	(action: 'add' | 'sub') => () => {
	// 		const inventory = Number(getValues().quantity);

	// 		if (action === 'add') {
	// 			setValue('quantity', String(inventory + 1));
	// 		} else if (action === 'sub') {
	// 			setValue('quantity', String(inventory - 1));
	// 		}
	// 	},
	// 	[]
	// );

	return null;

	// return (
	// 	<Controller
	// 		name='quantity'
	// 		render={({ field: { onBlur, onChange, value } }) => (
	// 			<View style={styles.container}>
	// 				<Typography weight='medium' style={{ color: theme.input.label }}>
	// 					Inventory
	// 				</Typography>
	// 				<View style={styles.right}>
	// 					<Pressable
	// 						disabled={value === '0'}
	// 						onPress={handleCounterPress('sub')}
	// 					>
	// 						<Icon name='minus' size={18} color='#505050' />
	// 					</Pressable>
	// 					<TextInput
	// 						value={value}
	// 						onChangeText={onChange}
	// 						onBlur={onBlur}
	// 						style={[styles.input, { color: theme.input.text }]}
	// 						keyboardType='number-pad'
	// 					/>
	// 					<Pressable onPress={handleCounterPress('add')}>
	// 						<Icon name='plus' size={18} color='#505050' />
	// 					</Pressable>
	// 				</View>
	// 			</View>
	// 		)}
	// 	/>
	// );
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: 16
	},
	right: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	input: {
		textAlign: 'center',
		marginHorizontal: 8,
		width: 50,
		fontSize: 18
	}
});

export default InventoryInput;
