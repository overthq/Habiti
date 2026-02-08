import React from 'react';
import { View, RefreshControl } from 'react-native';
import { ScrollableScreen, useTheme } from '@habiti/components';
import { useRoute, RouteProp } from '@react-navigation/native';

import CustomerDetails from '../components/order/CustomerDetails';
import OrderActions from '../components/order/OrderActions';
import OrderOverview from '../components/order/OrderOverview';
import OrderProducts from '../components/order/OrderProducts';
import PaymentInfo from '../components/order/PaymentInfo';
import useGoBack from '../hooks/useGoBack';
import { useOrderQuery } from '../data/queries';
import { OrdersStackParamList } from '../types/navigation';
import useRefresh from '../hooks/useRefresh';

const Order: React.FC = () => {
	const {
		params: { orderId }
	} = useRoute<RouteProp<OrdersStackParamList, 'Order'>>();
	const { data, isLoading, error, refetch } = useOrderQuery(orderId);
	const { refreshing, refresh } = useRefresh({ fetching: isLoading, refetch });
	const { theme } = useTheme();
	useGoBack();

	if (!data?.order) {
		return <View />;
	}

	return (
		<ScrollableScreen
			refreshControl={
				<RefreshControl
					refreshing={refreshing}
					onRefresh={refresh}
					tintColor={theme.text.secondary}
				/>
			}
		>
			<OrderOverview order={data.order} />
			<CustomerDetails user={data.order.user} />
			<OrderProducts products={data.order.products} />
			<PaymentInfo order={data.order} />
			<OrderActions orderId={data.order.id} status={data.order.status} />
		</ScrollableScreen>
	);
};

export default Order;
