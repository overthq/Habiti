import React from 'react';
import { View, Text } from 'react-native';
import { OrderQuery } from '../../types/api';
import { parseTimestamp } from '../../utils/date';

interface OrderOverviewProps {
	order: OrderQuery['order'];
}

// - In the overview, we can improve the date presentation
// - Something like Shopify's "Today at **:** AM/PM".

const OrderOverview: React.FC<OrderOverviewProps> = ({ order }) => {
	return (
		<View>
			<Text>{order.status}</Text>
			<Text>Date: {parseTimestamp(order.createdAt)}</Text>
		</View>
	);
};

export default OrderOverview;
