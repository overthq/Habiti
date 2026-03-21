import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography, Row, Spacer, Icon } from '@habiti/components';
import { formatNaira } from '@habiti/common';

import { relativeDate } from '../../utils/date';
import { Order } from '../../data/types';
import { ORDER_STATUS_LABELS } from '../../utils/orderStatus';

interface OrdersListItemProps {
	order: Order;
	onPress(): void;
}

const OrdersListItem: React.FC<OrdersListItemProps> = ({ order, onPress }) => {
	return (
		<Row onPress={onPress} style={styles.container}>
			<View>
				<Typography>{order.user.name}</Typography>
				<Spacer y={2} />
				<Typography size='small' variant='secondary' style={styles.date}>
					{ORDER_STATUS_LABELS[order.status]} · {relativeDate(order.createdAt)}
				</Typography>
			</View>
			<View style={styles.right}>
				<Typography style={styles.total}>{formatNaira(order.total)}</Typography>
				<Icon name='chevron-right' size={20} color='#999' />
			</View>
		</Row>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingVertical: 8,
		paddingLeft: 16,
		paddingRight: 8,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	date: {
		marginTop: 2
	},
	right: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4
	},
	total: {}
});

export default OrdersListItem;
