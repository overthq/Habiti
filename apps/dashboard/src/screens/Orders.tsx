import { Screen } from '@habiti/components';
import React from 'react';
import { View } from 'react-native';

import OrdersFilter from '../components/orders/OrdersFilter';
import OrdersList from '../components/orders/OrdersList';

const Orders: React.FC = () => {
	return (
		<Screen>
			<OrdersFilter />
			<View style={{ flex: 1 }}>
				<OrdersList />
			</View>
		</Screen>
	);
};

export default Orders;
