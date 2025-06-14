import React from 'react';
import { formatNaira } from '@habiti/common';
import {
	CustomImage,
	Icon,
	Row,
	Spacer,
	Typography,
	useTheme
} from '@habiti/components';
import { View, StyleSheet, Pressable } from 'react-native';

import { CartQuery, useUpdateCartProductMutation } from '../../types/api';
import useDebounced from '../../hooks/useDebounced';

interface CartProductProps {
	cartProduct: CartQuery['cart']['products'][number];
	onPress(): void;
}

const CartProduct: React.FC<CartProductProps> = ({ cartProduct, onPress }) => {
	const { product, quantity } = cartProduct;

	return (
		<Row style={styles.container} onPress={onPress}>
			<View style={{ flexDirection: 'row', alignItems: 'center' }}>
				<CustomImage uri={product.images[0]?.path} height={40} width={40} />
				<Spacer x={12} />
				<View>
					<Typography size='small'>{product.name}</Typography>
					<Spacer y={2} />
					<Typography size='small' weight='medium' variant='secondary'>
						{formatNaira(product.unitPrice * quantity)}
					</Typography>
				</View>
			</View>
			<View>
				<CartProductQuantity
					cartProduct={cartProduct}
					initialQuantity={quantity}
					maxQuantity={product.quantity}
				/>
				<Spacer y={4} />
			</View>
		</Row>
	);
};

interface CartProductQuantityProps {
	cartProduct: CartQuery['cart']['products'][number];
	initialQuantity: number;
	maxQuantity: number;
}

const CartProductQuantity: React.FC<CartProductQuantityProps> = ({
	cartProduct,
	initialQuantity,
	maxQuantity
}) => {
	const { theme } = useTheme();
	const [quantity, setQuantity] = React.useState(initialQuantity);
	const [, updateCartProduct] = useUpdateCartProductMutation();
	const debouncedQuantity = useDebounced(quantity, 300);

	const handleQuantityChange = (change: number) => {
		// disabled states do not work in this case since they make the
		// button default to the surrounding pressable.
		const newQuantity = quantity + change;

		// Allow decreasing even if current quantity is above max
		if (newQuantity < 1 || (change > 0 && newQuantity > maxQuantity)) return;

		setQuantity(newQuantity);
	};

	React.useEffect(() => {
		updateCartProduct({
			input: {
				cartId: cartProduct.cartId,
				productId: cartProduct.productId,
				quantity: debouncedQuantity
			}
		});
	}, [debouncedQuantity]);

	return (
		<View
			style={[
				styles.quantityInput,
				{ backgroundColor: theme.input.background }
			]}
		>
			<Pressable onPress={() => handleQuantityChange(-1)} hitSlop={12}>
				<Icon name='minus' size={16} color='#000000' />
			</Pressable>
			<Typography
				size='small'
				weight='medium'
				style={{ width: 24, textAlign: 'center' }}
			>
				{quantity}
			</Typography>
			<Pressable onPress={() => handleQuantityChange(1)} hitSlop={12}>
				<Icon name='plus' size={16} color='#000000' />
			</Pressable>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 6
	},
	quantityInput: {
		borderRadius: 6,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		paddingHorizontal: 8,
		paddingVertical: 4,
		alignSelf: 'flex-start'
	}
});

export default CartProduct;
