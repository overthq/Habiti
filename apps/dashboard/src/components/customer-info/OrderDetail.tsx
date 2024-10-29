import { formatNaira } from '@habiti/common';
import { CustomImage, Spacer, Typography } from '@habiti/components';
import React from 'react';
import { View, StyleSheet } from 'react-native';

import { CustomerInfoQuery } from '../../types/api';
import { parseTimestamp } from '../../utils/date';
import { plural } from '../../utils/strings';

interface OrderDetailProps {
	order: CustomerInfoQuery['user']['orders'][number];
}

const OrderDetail: React.FC<OrderDetailProps> = ({ order }) => {
	return (
		<View style={styles.container}>
			<Typography size='small'>{parseTimestamp(order.createdAt)}</Typography>
			<Spacer y={4} />
			<Typography size='small'>
				{plural('item', order.products.length)}
			</Typography>
			<Spacer y={4} />
			<Typography size='small'>{formatNaira(order.total)}</Typography>
			<Spacer y={4} />
			<View style={styles.row}>
				{order.products.slice(0, 3).map(product => (
					<View key={product.id} style={styles.item}>
						<CustomImage
							uri={product.product.images[0]?.path}
							height={48}
							width={48}
						/>
					</View>
				))}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginBottom: 16
	},
	row: {
		flexDirection: 'row',
		marginBottom: 4
	},
	item: {
		marginRight: 8
	}
});

export default OrderDetail;
