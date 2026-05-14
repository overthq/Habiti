import React from 'react';
import { View, StyleSheet } from 'react-native';
import { formatNaira } from '@habiti/common';
import { Typography } from '@habiti/components';

import { Order } from '../../data/types';
import { relativeTimestamp } from '../../utils/date';

interface OrderMetaProps {
	order: Order;
}

const OrderMeta: React.FC<OrderMetaProps> = ({ order }) => {
	return (
		<View style={styles.container}>
			<View style={styles.row}>
				<Typography>Date</Typography>
				<Typography variant='secondary'>
					{relativeTimestamp(order.createdAt)}
				</Typography>
			</View>
			<View style={styles.row}>
				<Typography>Total</Typography>
				<Typography variant='secondary'>{formatNaira(order.total)}</Typography>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingTop: 8,
		paddingBottom: 4,
		paddingHorizontal: 16,
		borderRadius: 4,
		marginVertical: 16
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 4
	}
});

export default OrderMeta;
