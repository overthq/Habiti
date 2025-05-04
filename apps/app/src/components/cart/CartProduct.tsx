import React from 'react';
import { formatNaira } from '@habiti/common';
import { CustomImage, Row, Spacer, Typography } from '@habiti/components';
import { View, StyleSheet } from 'react-native';

import { CartQuery } from '../../types/api';
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
		<Row style={styles.container} onPress={onPress}>
			<View style={{ flexDirection: 'row', alignItems: 'center' }}>
				<CustomImage uri={product.images[0]?.path} height={40} width={40} />
				<Spacer x={12} />
				<View>
					<Typography>{product.name}</Typography>
					<Spacer y={2} />
					<Typography size='small' variant='secondary'>
						{`${plural('unit', quantity)}`}
					</Typography>
				</View>
			</View>
			<Typography>{formatNaira(product.unitPrice * quantity)}</Typography>
		</Row>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 6
	}
});

export default CartProduct;
