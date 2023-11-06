import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { OrdersQuery } from '../../types/api';
import { formatNaira } from '../../utils/currency';
import { parseTimestamp } from '../../utils/date';
import Typography from '../global/Typography';

interface OrdersListItemProps {
	order: OrdersQuery['currentStore']['orders'][number];
	onPress(): void;
}

// TODO: Reflect order quantity
// - Probably disregard compactness.
// - Use StatusPill
// - (top-to-bottom): Date, Name, Status, Quantity
// - Add group actions to this list.

const OrdersListItem: React.FC<OrdersListItemProps> = ({ order, onPress }) => {
	return (
		<Pressable onPress={onPress} style={styles.container}>
			<View>
				<Typography style={styles.name}>{order.user.name}</Typography>
				<Text style={styles.date}>
					{order.status} · {parseTimestamp(order.createdAt)}
				</Text>
			</View>
			<Text style={styles.total}>{formatNaira(order.total)}</Text>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {
		width: '100%',
		paddingVertical: 8,
		paddingLeft: 16,
		paddingRight: 8,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderBottomWidth: 0.5,
		borderBottomColor: '#EDEDED'
	},
	name: {
		fontSize: 16
	},
	row: {},
	date: {
		fontSize: 14,
		marginTop: 2,
		color: '#777777'
	},
	total: {
		fontSize: 16,
		marginRight: 4
	}
});

export default OrdersListItem;
