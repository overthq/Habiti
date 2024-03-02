import { CustomImage, Icon, Typography } from '@market/components';
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
	return (
		<Pressable style={styles.container} onPress={onPress}>
			<View style={{ flexDirection: 'row' }}>
				<CustomImage uri={product.images[0]?.path} height={40} width={40} />
				<View>
					<Typography>{product.name}</Typography>
					<Typography style={styles.price}>
						{`${plural('unit', quantity)} · ${formatNaira(
							product.unitPrice * quantity
						)}`}
					</Typography>
				</View>
			</View>
			<Icon name='chevron-right' color='#505050' />
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginVertical: 4
	},
	image: {
		width: '100%',
		height: '100%'
	},
	price: {
		marginTop: 4,
		color: '#777777'
	}
});

export default CartProduct;
