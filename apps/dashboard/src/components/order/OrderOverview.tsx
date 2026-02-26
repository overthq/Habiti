import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Typography, useTheme } from '@habiti/components';
import { format } from 'date-fns';

import { Order } from '../../data/types';
import {
	ORDER_STATUS_LABELS,
	ORDER_STATUS_COLOR_VARIANTS
} from '../../utils/orderStatus';

interface OrderOverviewProps {
	order: Order;
}

const OrderOverview: React.FC<OrderOverviewProps> = ({ order }) => {
	const { theme } = useTheme();

	const statusLabel = ORDER_STATUS_LABELS[order.status];
	const statusColor =
		theme.badge[ORDER_STATUS_COLOR_VARIANTS[order.status]].color;
	const formattedDate = format(new Date(order.createdAt), 'MMM d, yyyy');

	return (
		<View style={styles.container}>
			<Typography size='small'>
				<Text style={{ color: statusColor }}>{statusLabel}</Text>
				{` · ${formattedDate}`}
			</Typography>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 16
	}
});

export default OrderOverview;
