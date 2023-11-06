import React from 'react';
import { View } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';

import OrderProducts from '../components/order/OrderProducts';
import PaymentInfo from '../components/order/PaymentInfo';
import OrderActions from '../components/order/OrderActions';
import CustomerDetails from '../components/order/CustomerDetails';
import OrderOverview from '../components/order/OrderOverview';

import useGoBack from '../hooks/useGoBack';

import { useOrderQuery } from '../types/api';
import { OrdersStackParamList } from '../types/navigation';
import ScrollableScreen from '../components/global/ScrollableScreen';

const Order: React.FC = () => {
	const {
		params: { orderId }
	} = useRoute<RouteProp<OrdersStackParamList, 'Order'>>();
	const [{ data, fetching }] = useOrderQuery({ variables: { id: orderId } });
	useGoBack();

	if (fetching || !data?.order) {
		return <View />;
	}

	return (
		<ScrollableScreen>
			<OrderOverview order={data.order} />
			<CustomerDetails user={data.order.user} />
			<OrderProducts products={data.order.products} />
			<OrderActions orderId={data.order.id} status={data.order.status} />
			<PaymentInfo order={data.order} />
		</ScrollableScreen>
	);
};

export default Order;
