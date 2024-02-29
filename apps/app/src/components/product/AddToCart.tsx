import React from 'react';
import { View, StyleSheet } from 'react-native';

import CartButton from './CartButton';
import QuantityControl from './QuantityControl';

interface AddToCartProps {
	storeId: string;
	productId: string;
	cartId?: string | null;
	inCart: boolean;
}

const AddToCart: React.FC<AddToCartProps> = ({
	storeId,
	productId,
	cartId,
	inCart
}) => {
	return (
		<View style={styles.container}>
			<QuantityControl cartId={cartId} productId={productId} />
			<CartButton
				storeId={storeId}
				productId={productId}
				cartId={cartId}
				inCart={inCart}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		width: '100%',
		paddingHorizontal: 16,
		marginVertical: 16
	}
});

export default AddToCart;
