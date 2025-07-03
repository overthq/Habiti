import { Icon, Typography, useTheme } from '@habiti/components';
import React from 'react';
import { View, StyleSheet, Pressable, Dimensions } from 'react-native';

import { useProductContext } from './ProductContext';

const QuantityControl: React.FC = () => {
	const { quantity, setQuantity } = useProductContext();
	const { theme } = useTheme();

	const decrementDisabled = React.useMemo(() => quantity === 1, [quantity]);

	// TODO: We want this to be disabled when the product is out of stock.
	const incrementDisabled = false;

	const increment = React.useCallback(() => setQuantity(q => q + 1), []);
	const decrement = React.useCallback(() => setQuantity(q => q - 1), []);

	return (
		<View
			style={[styles.controls, { backgroundColor: theme.input.background }]}
		>
			<Pressable hitSlop={16} disabled={decrementDisabled} onPress={decrement}>
				<Icon name='minus' color={theme.text.secondary} />
			</Pressable>
			<Typography size='large' weight='medium' number>
				{quantity}
			</Typography>
			<Pressable hitSlop={16} disabled={incrementDisabled} onPress={increment}>
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
