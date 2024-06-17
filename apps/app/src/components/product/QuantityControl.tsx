import { Icon, Typography, useTheme } from '@habiti/components';
import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';

interface QuantityControlProps {
	cartId?: string | null | undefined;
	productId: string;
	inCart: boolean;
}

// TODO:
// Simply, this should work as follows:
// The "Add to cart" button is a commit button.
// The quantity control button is local.
// Once it is out of sync with the reality on the server,
// The commit button (add to cart/update quantity) is enabled.
// The only prop it needs is the server quantity.

// NOTICE: This component currently does NOT work!

const QuantityControl: React.FC<QuantityControlProps> = ({ inCart }) => {
	const { theme } = useTheme();
	const [quantity, setQuantity] = React.useState(1);

	const decrementDisabled = React.useMemo(() => quantity === 1, [quantity]);

	const decrement = React.useCallback(() => {
		setQuantity(q => q - 1);
	}, []);

	const increment = React.useCallback(() => {
		setQuantity(q => q + 1);
	}, []);

	return (
		<View
			style={[styles.controls, { backgroundColor: theme.input.background }]}
		>
			<Pressable disabled={inCart || decrementDisabled} onPress={decrement}>
				<Icon name='minus' color={theme.text.secondary} />
			</Pressable>
			<Typography size='large' weight='medium' number>
				{quantity}
			</Typography>
			<Pressable disabled={inCart} onPress={increment}>
				<Icon name='plus' color={theme.text.secondary} />
			</Pressable>
		</View>
	);
};

const styles = StyleSheet.create({
	controls: {
		flexGrow: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		borderRadius: 4,
		paddingHorizontal: 16
	}
});

export default QuantityControl;
