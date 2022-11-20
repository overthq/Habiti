import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Icon } from '../Icon';

interface QuantityControlProps {
	productId: string;
}

const QuantityControl: React.FC<QuantityControlProps> = ({ productId }) => {
	const [quantity, setQuantity] = React.useState(0);
	// TODO: Iron out logic around whether or not the item is in the cart.

	const increment = React.useCallback(() => {
		if (quantity !== 0) {
			setQuantity(quantity - 1);
		}
	}, [quantity]);

	const decrement = React.useCallback(() => {
		setQuantity(quantity + 1);
	}, [quantity]);

	return (
		<View style={styles.controls}>
			<Pressable onPress={increment}>
				<Icon name='minus' color='#505050' />
			</Pressable>
			<Text style={styles.quantity}>{quantity}</Text>
			<Pressable onPress={decrement}>
				<Icon name='plus' color='#505050' />
			</Pressable>
		</View>
	);
};
const styles = StyleSheet.create({
	controls: {
		flexGrow: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		backgroundColor: '#D3D3D3',
		borderRadius: 4,
		paddingHorizontal: 16,
		marginRight: 16
	},
	title: {
		fontSize: 16,
		fontWeight: '500'
	},
	quantity: {
		fontSize: 16,
		fontVariant: ['tabular-nums']
	}
});

export default QuantityControl;
