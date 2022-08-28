import React from 'react';
import {
	View,
	Text,
	ScrollView,
	StyleSheet,
	ActivityIndicator
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';

import OrderProducts from '../components/order/OrderProducts';
import PaymentInfo from '../components/order/PaymentInfo';
import OrderActions from '../components/order/OrderActions';
import CustomerDetails from '../components/order/CustomerDetails';
import OrderOverview from '../components/order/OrderOverview';

import useGoBack from '../hooks/useGoBack';

import { useOrderQuery } from '../types/api';
import { OrdersStackParamsList } from '../types/navigation';

const Order: React.FC = () => {
	const {
		params: { orderId }
	} = useRoute<RouteProp<OrdersStackParamsList, 'Order'>>();
	const [{ data, fetching }] = useOrderQuery({ variables: { id: orderId } });
	useGoBack();

	if (fetching) {
		return (
			<View>
				<ActivityIndicator />
			</View>
		);
	} else if (!data?.order) {
		return (
			<View>
				<Text>An error has occured.</Text>
			</View>
		);
	}

	return (
		<ScrollView style={styles.container}>
			<OrderOverview order={data.order} />
			<CustomerDetails user={data.order.user} />
			<OrderProducts products={data.order.products} />
			<OrderActions />
			<PaymentInfo order={data.order} />
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

export default Order;
