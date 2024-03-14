import {
	CustomImage,
	Icon,
	Spacer,
	Typography,
	useTheme
} from '@market/components';
import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';

import { CartQuery } from '../../types/api';
import { formatNaira } from '../../utils/currency';
import { plural } from '../../utils/strings';

interface CartProductProps {
	cartProduct: CartQuery['cart']['products'][number];
	onPress(): void;
}

const CartProduct: React.FC<CartProductProps> = ({
	cartProduct: { product, quantity },
	onPress
}) => {
	const { theme } = useTheme();

	return (
		<Pressable style={styles.container} onPress={onPress}>
			<View style={{ flexDirection: 'row' }}>
				<CustomImage uri={product.images[0]?.path} height={40} width={40} />
				<Spacer x={8} />
				<View>
					<Typography>{product.name}</Typography>
					<Spacer y={2} />
					<Typography size='small' variant='secondary'>
						{`${plural('unit', quantity)} · ${formatNaira(
							product.unitPrice * quantity
						)}`}
					</Typography>
				</View>
			</View>
			<Icon name='chevron-right' color={theme.text.secondary} />
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginVertical: 4
	}
});

export default CartProduct;
