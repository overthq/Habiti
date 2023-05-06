import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Icon } from '../Icon';
import { useUpdateCartProductMutation } from '../../types/api';

interface QuantityControlProps {
	cartId?: string | null | undefined;
	productId: string;
}

const QuantityControl: React.FC<QuantityControlProps> = ({
	cartId,
	productId
}) => {
	const [{ fetching }, updateCartProduct] = useUpdateCartProductMutation();
	const [quantity, setQuantity] = React.useState(0);
	// TODO: Iron out logic around whether or not the item is in the cart.

	const decrement = React.useCallback(async () => {
		if (quantity !== 0 && cartId) {
			await updateCartProduct({
				input: { cartId, productId, quantity: quantity - 1 }
			});
			setQuantity(quantity - 1);
		}
	}, [quantity]);

	const increment = React.useCallback(() => {
		setQuantity(quantity + 1);
	}, [quantity]);

	return (
		<View style={styles.controls}>
			<Pressable onPress={increment} disabled={fetching}>
				<Icon name='minus' color='#505050' />
			</Pressable>
			<Text style={styles.quantity}>{quantity}</Text>
			<Pressable onPress={decrement} disabled={fetching}>
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
