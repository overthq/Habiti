import { CustomImage, Typography } from '@market/components';
import React from 'react';
import { View, StyleSheet } from 'react-native';

import { CustomerInfoQuery } from '../../types/api';
import { formatNaira } from '../../utils/currency';
import { parseTimestamp } from '../../utils/date';
import { plural } from '../../utils/strings';

interface OrderDetailProps {
	order: CustomerInfoQuery['user']['orders'][number];
}

const OrderDetail: React.FC<OrderDetailProps> = ({ order }) => {
	return (
		<View style={styles.container}>
			<Typography size='small' style={styles.info}>
				{plural('item', order.products.length)} ·{' '}
				{parseTimestamp(order.createdAt)} · {formatNaira(order.total)}
			</Typography>
			<View style={styles.row}>
				{order.products.slice(0, 3).map(product => (
					<View key={product.id} style={styles.item}>
						<CustomImage height={60} width={60} />
					</View>
				))}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginBottom: 8
	},
	info: {
		marginBottom: 4
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
