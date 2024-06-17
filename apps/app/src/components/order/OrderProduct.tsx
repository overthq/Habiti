import { formatNaira } from '@habiti/common';
import { CustomImage, Typography } from '@habiti/components';
import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';

import { OrderQuery } from '../../types/api';
import { plural } from '../../utils/strings';

interface OrderProductProps {
	orderProduct: OrderQuery['order']['products'][number];
	onPress(): void;
}

const OrderProduct: React.FC<OrderProductProps> = ({
	orderProduct: { product, quantity, unitPrice },
	onPress
}) => {
	return (
		<Pressable style={styles.container} onPress={onPress}>
			<View style={styles.left}>
				<CustomImage
					height={40}
					width={40}
					uri={product.images[0]?.path}
					style={styles.image}
				/>
				<View>
					<Typography>{product.name}</Typography>
					<Typography variant='secondary' size='small' style={styles.price}>
						{`${plural('unit', quantity)} · `}
						{formatNaira(quantity * unitPrice)}
					</Typography>
				</View>
			</View>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 4
	},
	left: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	image: {
		marginRight: 8
	},
	price: {
		marginTop: 2
	}
});

export default OrderProduct;
