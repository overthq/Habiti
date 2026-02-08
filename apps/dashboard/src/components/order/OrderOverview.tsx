import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Spacer, Typography } from '@habiti/components';

import StatusPill from './StatusPill';
import { parseTimestamp } from '../../utils/date';
import { Order } from '../../data/types';

interface OrderOverviewProps {
	order: Order;
}

// TODO:
// - We should improve the date presentation.
// - Something like "Today at **:** AM/PM".

const OrderOverview: React.FC<OrderOverviewProps> = ({ order }) => {
	return (
		<View style={styles.container}>
			<StatusPill status={order.status} />
			<Spacer y={4} />
			<Typography style={styles.date}>
				{parseTimestamp(order.createdAt)}
			</Typography>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 16
	},
	date: {
		marginTop: 4
	}
});

export default OrderOverview;
