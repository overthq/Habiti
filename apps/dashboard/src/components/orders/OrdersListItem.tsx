import { formatNaira } from '@habiti/common';
import { Typography, Row, Spacer } from '@habiti/components';
import React from 'react';
import { View, StyleSheet } from 'react-native';

import { OrdersQuery } from '../../types/api';
import { parseTimestamp } from '../../utils/date';

interface OrdersListItemProps {
	order: OrdersQuery['currentStore']['orders'][number];
	onPress(): void;
}

const OrdersListItem: React.FC<OrdersListItemProps> = ({ order, onPress }) => {
	return (
		<Row onPress={onPress} style={styles.container}>
			<View>
				<Typography weight='medium'>{order.user.name}</Typography>
				<Spacer y={2} />
				<Typography size='small' style={styles.date}>
					{order.status} · {parseTimestamp(order.createdAt)}
				</Typography>
			</View>
			<Typography style={styles.total}>{formatNaira(order.total)}</Typography>
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
	total: {
		marginRight: 4
	}
});

export default OrdersListItem;
