import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@habiti/components';

import CartButton from './CartButton';
import QuantityControl from './QuantityControl';

const AddToCart: React.FC = () => {
	const { theme } = useTheme();
	const { bottom } = useSafeAreaInsets();

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
			<QuantityControl />
			<CartButton />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		gap: 16,
		padding: 16,
		paddingBottom: 8,
		borderTopWidth: 0.5,
		bottom: 0
	}
});

export default AddToCart;
