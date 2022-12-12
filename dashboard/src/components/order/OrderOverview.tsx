import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import StatusPill from './StatusPill';
import { parseTimestamp } from '../../utils/date';
import { OrderQuery } from '../../types/api';

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
			<Text style={styles.date}>{parseTimestamp(order.createdAt)}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 16
	},
	date: {
		fontSize: 16,
		marginTop: 4
	}
});

export default OrderOverview;
