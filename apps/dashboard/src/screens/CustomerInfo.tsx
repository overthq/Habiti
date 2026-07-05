import React from 'react';
import { View } from 'react-native';
import { ScrollableScreen, Spacer, Typography } from '@habiti/components';

import OrderDetail from '../components/customer-info/OrderDetail';
import { useCustomerInfoQuery } from '../data/queries';
import type { OrdersStackScreenProps } from '../navigation/types';

const CustomerInfo: React.FC<OrdersStackScreenProps<'CustomerInfo'>> = ({
	navigation,
	route
}) => {
	const { params } = route;
	const { data, isLoading } = useCustomerInfoQuery(params.userId);

	const handleOrderPress = (id: string) => {
		navigation.navigate('Order', { orderId: id });
	};

	if (isLoading || !data) {
		return <View />;
	}

	return (
		<ScrollableScreen>
			<Spacer y={16} />
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

export default CustomerInfo;
