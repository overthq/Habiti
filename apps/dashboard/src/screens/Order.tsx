import React from 'react';
import { View, RefreshControl } from 'react-native';
import { ScrollableScreen, useTheme } from '@habiti/components';
import { useRoute, RouteProp } from '@react-navigation/native';

import AwaitingPickupBanner from '../components/order/AwaitingPickupBanner';
import CustomerDetails from '../components/order/CustomerDetails';
import OrderActions from '../components/order/OrderActions';
import OrderOverview from '../components/order/OrderOverview';
import OrderProducts from '../components/order/OrderProducts';
import PaymentInfo from '../components/order/PaymentInfo';
import useRefresh from '../hooks/useRefresh';
import { useOrderQuery } from '../data/queries';
import { OrdersStackParamList } from '../navigation/types';

const Order = () => {
	const {
		params: { orderId }
	} = useRoute<RouteProp<OrdersStackParamList, 'Order'>>();
	const { data, refetch } = useOrderQuery(orderId);
	const { isRefreshing, onRefresh } = useRefresh({ refetch });
	const { theme } = useTheme();

	if (!data?.order) {
		return <View />;
	}

	return (
		<ScrollableScreen
			refreshControl={
				<RefreshControl
					refreshing={isRefreshing}
					onRefresh={onRefresh}
					tintColor={theme.text.secondary}
				/>
			}
		>
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
