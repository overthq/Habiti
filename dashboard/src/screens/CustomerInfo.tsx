import React from 'react';
import { View, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';

import ScrollableScreen from '../components/global/ScrollableScreen';
import Typography from '../components/global/Typography';
import useGoBack from '../hooks/useGoBack';
import { useCustomerInfoQuery } from '../types/api';
import type { AppStackParamList } from '../types/navigation';
import OrderDetail from '../components/customer-info/OrderDetail';

// TODO: This screen should contain a brief overview of the orders
// a specific user has made. Beneath this should be a full list of
// the orders.

const CustomerInfo: React.FC = () => {
	const { params } = useRoute<RouteProp<AppStackParamList, 'CustomerInfo'>>();
	const [{ data, fetching }] = useCustomerInfoQuery({
		variables: { userId: params.userId }
	});

	useGoBack('x');

	if (fetching || !data) {
		return <View />;
	}

	return (
		<ScrollableScreen style={styles.container}>
			<Typography weight='medium' size='large'>
				{data.user.name}
			</Typography>
			<Typography variant='label' style={styles.sectionHeader}>
				Previous Orders
			</Typography>
			{data.user.orders.map(order => (
				<OrderDetail key={order.id} order={order} />
			))}
		</ScrollableScreen>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 16
	},
	sectionHeader: {
		marginVertical: 8
	}
});

export default CustomerInfo;
