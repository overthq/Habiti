import { ScrollableScreen, Spacer, Typography } from '@habiti/components';
import { RouteProp, useRoute } from '@react-navigation/native';
import React from 'react';
import { View, StyleSheet } from 'react-native';

import OrderDetail from '../components/customer-info/OrderDetail';
import useGoBack from '../hooks/useGoBack';
import { useCustomerInfoQuery } from '../types/api';
import type { AppStackParamList } from '../types/navigation';

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
			<Spacer y={4} />
			<Typography variant='label'>Previous Orders</Typography>
			<Spacer y={16} />
			{data.user.orders.map(order => (
				<OrderDetail key={order.id} order={order} />
			))}
		</ScrollableScreen>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 16
	}
});

export default CustomerInfo;
