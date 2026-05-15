import React from 'react';
import { View } from 'react-native';
import { Spacer, Typography } from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';

import CartProduct from './CartProduct';
import { AppStackParamList } from '../../navigation/types';
import { useCart } from './CartContext';

import type { CartProduct as CartProductType } from '../../data/types';

interface CartSummaryProps {
	products: CartProductType[];
}

const CartSummary: React.FC<CartSummaryProps> = () => {
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();
	const { products } = useCart();

	const handleCartProductPress = React.useCallback(
		(productId: string) => () => {
			navigate('Product', { productId });
		},
		[navigate]
	);

	return (
		<View>
			<Typography
				weight='medium'
				variant='secondary'
				style={{ marginLeft: 16 }}
			>
				Order Summary
			</Typography>

			<Spacer y={4} />

			{products.map(cartProduct => (
				<CartProduct
					key={`${cartProduct.cartId}-${cartProduct.productId}`}
					cartProduct={cartProduct}
					onPress={handleCartProductPress(cartProduct.productId)}
				/>
			))}
		</View>
	);
};

export default CartSummary;
