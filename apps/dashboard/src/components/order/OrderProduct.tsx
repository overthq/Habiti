import React from 'react';
import { View, StyleSheet } from 'react-native';
import { formatNaira } from '@habiti/common';
import { CustomImage, Typography, Row } from '@habiti/components';

import { OrderProduct as OrderProductType } from '../../data/types';

interface OrderProductProps {
	orderProduct: OrderProductType;
	onPress(): void;
}

const OrderProduct: React.FC<OrderProductProps> = ({
	orderProduct: { product, quantity, unitPrice },
	onPress
}) => (
	<Row key={product.id} onPress={onPress} style={styles.container}>
		<View style={styles.image}>
			<CustomImage uri={product.images[0]?.path} height={40} width={40} />
		</View>
		<View>
			<Typography>{product.name}</Typography>
			<Typography size='small' variant='label'>
				{formatNaira(unitPrice * quantity)}
			</Typography>
		</View>
	</Row>
);

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 16,
		paddingVertical: 6
	},
	image: {
		marginRight: 8
	}
});

export default OrderProduct;
