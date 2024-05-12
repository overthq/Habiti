import { Button } from '@market/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet } from 'react-native';

import { useAddToCartMutation } from '../../types/api';
import { AppStackParamList } from '../../types/navigation';

interface CartButtonProps {
	storeId: string;
	productId: string;
	cartId?: string | null;
	inCart: boolean;
}

const CartButton: React.FC<CartButtonProps> = ({
	storeId,
	productId,
	cartId,
	inCart
}) => {
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();
	const [{ fetching }, addToCart] = useAddToCartMutation();

	const handlePress = React.useCallback(async () => {
		await addToCart({
			input: { storeId, productId, quantity: 1 }
		});
	}, [storeId, productId]);

	const goToCart = React.useCallback(() => {
		if (cartId) {
			navigate('Cart', { cartId });
		}
	}, [cartId]);

	if (!cartId || (cartId && !inCart)) {
		return (
			<Button
				loading={fetching}
				onPress={handlePress}
				text='Add to cart'
				disabled={inCart}
				style={styles.button}
			/>
		);
	} else {
		return (
			<Button text='View in cart' onPress={goToCart} style={styles.button} />
		);
	}
};

const styles = StyleSheet.create({
	button: {
		flexGrow: 1
	}
});

export default CartButton;
