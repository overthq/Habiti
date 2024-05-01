import { useTheme } from '@market/components';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
	const { theme } = useTheme();
	const { bottom } = useSafeAreaInsets();

	return (
		<View
			style={[styles.container, { bottom, borderTopColor: theme.border.color }]}
		>
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
		position: 'absolute',
		flexDirection: 'row',
		width: '100%',
		paddingHorizontal: 16,
		paddingTop: 16,
		paddingBottom: 8,
		borderTopWidth: 1,
		gap: 16
	}
});

export default AddToCart;
