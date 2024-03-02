import { CustomImage, Icon, Typography } from '@market/components';
import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';

import { OrderQuery } from '../../types/api';
import { formatNaira } from '../../utils/currency';
import { plural } from '../../utils/strings';

interface OrderProductProps {
	orderProduct: OrderQuery['order']['products'][-1];
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
					<Typography variant='secondary' style={styles.price}>
						{`${plural('unit', quantity)} · `}
						{formatNaira(quantity * unitPrice)}
					</Typography>
				</View>
			</View>
			<Icon name='chevron-right' />
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
		marginTop: 4
	}
});

export default OrderProduct;
