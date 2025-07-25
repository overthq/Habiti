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

import { CartQuery } from '../../types/api';
import { useCart } from './CartContext';

interface CartProductProps {
	cartProduct: CartQuery['cart']['products'][number];
	onPress(): void;
}

const CartProduct: React.FC<CartProductProps> = ({ cartProduct, onPress }) => {
	const { product, quantity } = cartProduct;

	const hasExceededMaxQuantity = quantity > product.quantity;

	return (
		<Row style={styles.container} onPress={onPress}>
			<View style={{ flexDirection: 'row', alignItems: 'center' }}>
				<CustomImage uri={product.images[0]?.path} height={48} width={48} />
				<Spacer x={12} />
				<View>
					<Typography>{product.name}</Typography>
					<Spacer y={2} />
					<Typography
						weight='medium'
						variant={hasExceededMaxQuantity ? 'error' : 'secondary'}
					>
						{formatNaira(product.unitPrice * quantity)}
					</Typography>
				</View>
			</View>
			<View>
				<CartProductQuantity
					cartProduct={cartProduct}
					quantity={quantity}
					maxQuantity={product.quantity}
				/>
				<Spacer y={4} />
			</View>
		</Row>
	);
};

interface CartProductQuantityProps {
	cartProduct: CartQuery['cart']['products'][number];
	quantity: number;
	maxQuantity: number;
}

const CartProductQuantity: React.FC<CartProductQuantityProps> = ({
	cartProduct,
	quantity,
	maxQuantity
}) => {
	const { theme } = useTheme();
	const { updateProductQuantity } = useCart();

	const incrementProductQuantity = React.useCallback(() => {
		updateProductQuantity(cartProduct.productId, quantity + 1);
	}, [cartProduct.productId, quantity, updateProductQuantity]);

	const decrementProductQuantity = React.useCallback(() => {
		updateProductQuantity(cartProduct.productId, Math.max(quantity - 1, 0));
	}, [cartProduct.productId, quantity, updateProductQuantity]);

	return (
		<View
			style={[
				styles.quantityInput,
				{ backgroundColor: theme.input.background }
			]}
		>
			<Pressable onPress={decrementProductQuantity} hitSlop={12}>
				<Icon name='minus' size={20} color={theme.text.primary} />
			</Pressable>
			<Typography weight='medium' style={{ width: 24, textAlign: 'center' }}>
				{quantity}
			</Typography>
			<Pressable onPress={incrementProductQuantity} hitSlop={12}>
				<Icon name='plus' size={20} color={theme.text.primary} />
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
