import { formatNaira } from '@market/common';
import { CustomImage, Typography } from '@market/components';
import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';

import { OrderQuery } from '../../types/api';

interface OrderProductProps {
	orderProduct: OrderQuery['order']['products'][number];
	onPress(): void;
}

const OrderProduct: React.FC<OrderProductProps> = ({
	orderProduct: { product, quantity, unitPrice },
	onPress
}) => (
	<Pressable key={product.id} onPress={onPress} style={styles.container}>
		<View style={styles.image}>
			<CustomImage uri={product.images[0]?.path} height={40} width={40} />
		</View>
		<View>
			<Typography>{product.name}</Typography>
			<Typography size='small' variant='label'>
				{formatNaira(unitPrice * quantity)}
			</Typography>
		</View>
	</Pressable>
);

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 16,
		paddingVertical: 4
	},
	image: {
		marginRight: 8
	}
});

export default OrderProduct;
