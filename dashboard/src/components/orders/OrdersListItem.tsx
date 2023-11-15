import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { OrdersQuery } from '../../types/api';
import { formatNaira } from '../../utils/currency';
import { parseTimestamp } from '../../utils/date';
import Typography from '../global/Typography';
import useTheme from '../../hooks/useTheme';

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
	const { theme } = useTheme();

	return (
		<Pressable
			onPress={onPress}
			style={[styles.container, { borderBottomColor: theme.border.color }]}
		>
			<View>
				<Typography style={{ fontWeight: '500' }}>{order.user.name}</Typography>
				<Typography size='small' variant='label' style={styles.date}>
					{order.status} · {parseTimestamp(order.createdAt)}
				</Typography>
			</View>
			<Typography style={styles.total}>{formatNaira(order.total)}</Typography>
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
		borderBottomWidth: 0.5
	},
	row: {},
	date: {
		marginTop: 2
	},
	total: {
		marginRight: 4
	}
});

export default OrdersListItem;
