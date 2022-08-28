import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
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
			<Text>{order.status}</Text>
			<Text>{parseTimestamp(order.createdAt)}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 16
	}
});

export default OrderOverview;
