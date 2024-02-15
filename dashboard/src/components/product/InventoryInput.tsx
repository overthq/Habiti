import React from 'react';
import { View, Pressable, TextInput, StyleSheet } from 'react-native';

import { Icon } from '../Icon';
import { Controller } from 'react-hook-form';
import Typography from '../global/Typography';
import useTheme from '../../hooks/useTheme';

const InventoryInput = () => {
	const { theme } = useTheme();

	const handleCounterPress = React.useCallback(
		(action: 'add' | 'sub') => () => {
			// const inventory = Number(values.quantity);
			// if (!Number.isNaN(inventory)) {
			// 	if (action === 'add') {
			// 		setFieldValue('quantity', String(inventory + 1));
			// 	} else {
			// 		setFieldValue('quantity', String(inventory - 1));
			// 	}
			// }
		},
		[]
	);

	return (
		<Controller
			name='quantity'
			render={({ field: { onBlur, onChange, value } }) => (
				<View style={styles.container}>
					<Typography weight='medium' style={{ color: theme.input.label }}>
						Inventory
					</Typography>
					<View style={styles.right}>
						<Pressable onPress={handleCounterPress('add')}>
							<Icon name='plus' size={18} color='#505050' />
						</Pressable>
						<TextInput
							value={value}
							onChangeText={onChange}
							onBlur={onBlur}
							style={styles.input}
						/>
						<Pressable onPress={handleCounterPress('sub')}>
							<Icon name='minus' size={18} color='#505050' />
						</Pressable>
					</View>
				</View>
			)}
		/>
	);
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
