import { Spacer, Typography } from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';

import CartProduct from './CartProduct';
import { CartQuery } from '../../types/api';
import { AppStackParamList } from '../../types/navigation';

interface CartSummaryProps {
	products: CartQuery['cart']['products'];
}

const CartSummary: React.FC<CartSummaryProps> = ({ products }) => {
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();

	const handleCartProductPress = React.useCallback(
		(productId: string) => () => {
			navigate('Product', { productId });
		},
		[navigate]
	);

	return (
		<View style={{ paddingHorizontal: 16 }}>
			<Typography weight='medium' variant='secondary'>
				Order Summary
			</Typography>

			<Spacer y={4} />

			{products.map(cartProduct => (
				<CartProduct
					key={cartProduct.id}
					cartProduct={cartProduct}
					onPress={handleCartProductPress(cartProduct.productId)}
				/>
			))}
		</View>
	);
};

export default CartSummary;
