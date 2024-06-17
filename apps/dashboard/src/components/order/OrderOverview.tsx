import { Spacer, Typography } from '@habiti/components';
import React from 'react';
import { View, StyleSheet } from 'react-native';

import StatusPill from './StatusPill';
import { OrderQuery } from '../../types/api';
import { parseTimestamp } from '../../utils/date';

interface OrderOverviewProps {
	order: OrderQuery['order'];
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
