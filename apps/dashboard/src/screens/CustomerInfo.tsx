import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ScrollableScreen, Spacer, Typography } from '@habiti/components';
import {
	NavigationProp,
	RouteProp,
	useNavigation,
	useRoute
} from '@react-navigation/native';

import OrderDetail from '../components/customer-info/OrderDetail';
import { useCustomerInfoQuery } from '../data/queries';
import type { OrdersStackParamList } from '../types/navigation';

const CustomerInfo = () => {
	const { params } =
		useRoute<RouteProp<OrdersStackParamList, 'CustomerInfo'>>();
	const { data, isLoading } = useCustomerInfoQuery(params.userId);
	const { navigate } = useNavigation<NavigationProp<OrdersStackParamList>>();

	const handleOrderPress = (id: string) => {
		navigate('Order', { orderId: id });
	};

	if (isLoading || !data) {
		return <View />;
	}

	return (
		<ScrollableScreen style={styles.container}>
			<Typography weight='medium' size='xlarge'>
				{data.user.name}
			</Typography>
			<Spacer y={2} />
			<Typography variant='secondary'>{data.user.email}</Typography>
			<Spacer y={12} />
			<Typography weight='medium'>Previous Orders</Typography>
			{data.user.orders.map(order => (
				<OrderDetail
					key={order.id}
					order={order}
					onPress={() => handleOrderPress(order.id)}
				/>
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
