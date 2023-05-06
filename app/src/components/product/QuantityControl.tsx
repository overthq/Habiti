import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Icon } from '../Icon';

interface QuantityControlProps {
	cartId?: string | null | undefined;
	productId: string;
}

// TODO:
// Simply, this should work as follows:
// The "Add to cart" button is a commit button.
// The quantity control button is local.
// Once it is out of sync with the reality on the server,
// The commit button (add to cart/update quantity) is enabled.
// The only prop it needs is the server quantity.

const QuantityControl: React.FC<QuantityControlProps> = ({
	cartId,
	productId
}) => {
	const [quantity, setQuantity] = React.useState(0);

	const decrement = React.useCallback(async () => {
		if (quantity !== 0 && cartId) {
			setQuantity(quantity - 1);
		}
	}, [quantity]);

	const increment = React.useCallback(() => {
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
