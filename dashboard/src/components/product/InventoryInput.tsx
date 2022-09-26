import React from 'react';
import { View, Text, Pressable, TextInput, StyleSheet } from 'react-native';
import { useFormikContext } from 'formik';

import { Icon } from '../Icon';

const InventoryInput = () => {
	const { values, handleChange, handleBlur, setFieldValue } = useFormikContext<{
		quantity: string;
	}>();

	const handleCounterPress = React.useCallback(
		(action: 'add' | 'sub') => () => {
			const inventory = Number(values.quantity);

			if (!Number.isNaN(inventory)) {
				if (action === 'add') {
					setFieldValue('quantity', String(inventory + 1));
				} else {
					setFieldValue('quantity', String(inventory - 1));
				}
			}
		},
		[values.quantity]
	);

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Inventory</Text>
			<View style={styles.right}>
				<Pressable onPress={handleCounterPress('add')}>
					<Icon name='plus' size={18} color='#505050' />
				</Pressable>
				<TextInput
					value={values.quantity}
					onChangeText={handleChange('quantity')}
					onBlur={handleBlur('quantity')}
					style={styles.input}
				/>
				<Pressable onPress={handleCounterPress('sub')}>
					<Icon name='minus' size={18} color='#505050' />
				</Pressable>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: 16,
		backgroundColor: '#FFFFFF'
	},
	title: {
		fontSize: 16,
		fontWeight: '500',
		color: '#505050'
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
