import { Spacer, Typography } from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';

import CartProduct from './CartProduct';
import { CartQuery } from '../../types/api';
import { AppStackParamList } from '../../types/navigation';
import { useCart } from './CartContext';

interface CartSummaryProps {
	products: CartQuery['cart']['products'];
}

const CartSummary: React.FC<CartSummaryProps> = () => {
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();
	const { products, dispatch } = useCart();

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
