import { Icon, Typography, useTheme } from '@habiti/components';
import React from 'react';
import { View, StyleSheet, Pressable, Dimensions } from 'react-native';

interface QuantityControlProps {
	inCart: boolean;
	quantity: number;
	setQuantity: React.Dispatch<React.SetStateAction<number>>;
}

// TODO:
// Simply, this should work as follows:
// The "Add to cart" button is a commit button.
// The quantity control button is local.
// Once it is out of sync with the reality on the server,
// The commit button (add to cart/update quantity) is enabled.
// The only prop it needs is the server quantity.

// NOTICE: This component currently does NOT work!

const QuantityControl: React.FC<QuantityControlProps> = ({
	inCart,
	quantity,
	setQuantity
}) => {
	const { theme } = useTheme();

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
			<Pressable
				hitSlop={16}
				disabled={inCart || decrementDisabled}
				onPress={decrement}
			>
				<Icon name='minus' color={theme.text.secondary} />
			</Pressable>
			<Typography size='large' weight='medium' number>
				{quantity}
			</Typography>
			<Pressable hitSlop={16} disabled={inCart} onPress={increment}>
				<Icon name='plus' color={theme.text.secondary} />
			</Pressable>
		</View>
	);
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
	controls: {
		width: (width - 16 * 3) / 2,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		borderRadius: 4,
		paddingHorizontal: 16
	}
});

export default QuantityControl;
