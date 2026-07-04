import React from 'react';
import { View } from 'react-native';
import { ScrollableScreen, Spacer } from '@habiti/components';
import { useRoute, RouteProp } from '@react-navigation/native';

import AwaitingPickupBanner from '../components/order/AwaitingPickupBanner';
import CustomerDetails from '../components/order/CustomerDetails';
import OrderActions from '../components/order/OrderActions';
import OrderOverview from '../components/order/OrderOverview';
import OrderProducts from '../components/order/OrderProducts';
import PaymentInfo from '../components/order/PaymentInfo';
import useRefresh from '../hooks/useRefresh';
import Refresher from '../components/Refresher';
import { useOrderQuery } from '../data/queries';
import { OrdersStackParamList } from '../navigation/types';

const Order = () => {
	const {
		params: { orderId }
	} = useRoute<RouteProp<OrdersStackParamList, 'Order'>>();
	const { data, refetch } = useOrderQuery(orderId);
	const { isRefreshing, onRefresh } = useRefresh({ refetch });

	if (!data?.order) {
		return <View />;
	}

	return (
		<ScrollableScreen
			refreshControl={
				<Refresher refreshing={isRefreshing} onRefresh={onRefresh} />
			}
		>
			<Spacer y={16} />
			<OrderOverview order={data.order} />
			<AwaitingPickupBanner status={data.order.status} />
			<CustomerDetails user={data.order.user} />
			<OrderProducts products={data.order.products} />
			<PaymentInfo order={data.order} />
			<OrderActions orderId={data.order.id} status={data.order.status} />
		</ScrollableScreen>
	);
};

export default Order;
