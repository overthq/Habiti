import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Badge, Typography } from '@habiti/components';
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
	const statusLabel = ORDER_STATUS_LABELS[order.status];
	const statusVariant = ORDER_STATUS_COLOR_VARIANTS[order.status];
	const formattedDate = format(
		new Date(order.createdAt),
		"MMMM do, yyyy 'at' h:mma"
	);

	return (
		<View style={styles.container}>
			<Badge text={statusLabel} variant={statusVariant} />
			<Typography size='small' weight='medium' variant='secondary'>
				{formattedDate}
			</Typography>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: 'flex-start',
		gap: 8,
		paddingBottom: 16
	}
});

export default OrderOverview;
