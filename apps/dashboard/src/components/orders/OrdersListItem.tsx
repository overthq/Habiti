import { formatNaira } from '@market/common';
import { useTheme, Typography } from '@market/components';
import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';

import { OrdersQuery } from '../../types/api';
import { parseTimestamp } from '../../utils/date';

interface OrdersListItemProps {
	order: OrdersQuery['currentStore']['orders'][number];
	onPress(): void;
}

const OrdersListItem: React.FC<OrdersListItemProps> = ({ order, onPress }) => {
	const { theme } = useTheme();

	return (
		<Pressable
			onPress={onPress}
			style={[styles.container, { borderBottomColor: theme.border.color }]}
		>
			<View>
				<Typography weight='medium'>{order.user.name}</Typography>
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
		paddingVertical: 8,
		paddingLeft: 16,
		paddingRight: 8,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderBottomWidth: 0.5
	},
	date: {
		marginTop: 2
	},
	total: {
		marginRight: 4
	}
});

export default OrdersListItem;
