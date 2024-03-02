import { ScrollableScreen } from '@market/components';
import { useRoute, RouteProp } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';

import CustomerDetails from '../components/order/CustomerDetails';
import OrderActions from '../components/order/OrderActions';
import OrderOverview from '../components/order/OrderOverview';
import OrderProducts from '../components/order/OrderProducts';
import PaymentInfo from '../components/order/PaymentInfo';
import useGoBack from '../hooks/useGoBack';
import { useOrderQuery } from '../types/api';
import { OrdersStackParamList } from '../types/navigation';

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
			<PaymentInfo order={data.order} />
			<OrderActions orderId={data.order.id} status={data.order.status} />
		</ScrollableScreen>
	);
};

export default Order;
