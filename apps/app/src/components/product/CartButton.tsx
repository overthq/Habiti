import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { Button } from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';

import { useAddToCartMutation } from '../../types/api';
import { AppStackParamList } from '../../types/navigation';

interface CartButtonProps {
	storeId: string;
	productId: string;
	cartId?: string | null;
	inCart: boolean;
	quantity: number;
}

const CartButton: React.FC<CartButtonProps> = ({
	storeId,
	productId,
	cartId,
	inCart,
	quantity
}) => {
	const { navigate, goBack } =
		useNavigation<NavigationProp<AppStackParamList>>();
	const [{ fetching }, addToCart] = useAddToCartMutation();

	const handlePress = React.useCallback(async () => {
		await addToCart({
			input: { storeId, productId, quantity }
		});

		goBack();
	}, [storeId, productId]);

	const goToCart = React.useCallback(() => {
		if (cartId) navigate('Cart', { cartId });
	}, [cartId]);

	const isNotInCart = !cartId || (cartId && !inCart);

	return (
		<Button
			loading={fetching}
			onPress={isNotInCart ? handlePress : goToCart}
			text={isNotInCart ? 'Add to cart' : 'In cart'}
			disabled={inCart}
			style={styles.button}
		/>
	);
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
	button: {
		width: (width - 16 * 3) / 2
	}
});

export default CartButton;
