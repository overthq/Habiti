import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { OrdersQuery } from '../../types/api';
import { formatNaira } from '../../utils/currency';
import { parseTimestamp } from '../../utils/date';

interface OrdersListItemProps {
	order: OrdersQuery['currentStore']['orders'][number];
	onPress(): void;
}

const OrdersListItem: React.FC<OrdersListItemProps> = ({ order, onPress }) => {
	return (
		<Pressable onPress={onPress} style={styles.container}>
			<View>
				<Text style={styles.name}>{order.user.name}</Text>
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
		backgroundColor: '#FFFFFF',
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
