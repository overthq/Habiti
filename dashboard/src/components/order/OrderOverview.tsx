import React from 'react';
import { View, StyleSheet } from 'react-native';

import StatusPill from './StatusPill';
import { parseTimestamp } from '../../utils/date';
import { OrderQuery } from '../../types/api';
import Typography from '../global/Typography';

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
