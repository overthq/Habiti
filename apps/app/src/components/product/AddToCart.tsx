import { useTheme } from '@habiti/components';
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
	quantity?: number | null;
}

const AddToCart: React.FC<AddToCartProps> = ({
	storeId,
	productId,
	cartId,
	inCart,
	quantity: initialQuantity
}) => {
	const { theme } = useTheme();
	const { bottom } = useSafeAreaInsets();
	const [quantity, setQuantity] = React.useState(initialQuantity || 1);

	return (
		<View
			style={[
				styles.container,
				{
					backgroundColor: theme.screen.background,
					paddingBottom: bottom,
					borderTopColor: theme.border.color
				}
			]}
		>
			<QuantityControl
				inCart={inCart}
				quantity={quantity}
				setQuantity={setQuantity}
			/>
			<CartButton
				storeId={storeId}
				productId={productId}
				cartId={cartId}
				inCart={inCart}
				quantity={quantity}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		flexDirection: 'row',
		gap: 16,
		padding: 16,
		paddingBottom: 8,
		borderTopWidth: 0.5,
		bottom: 0
	}
});

export default AddToCart;
