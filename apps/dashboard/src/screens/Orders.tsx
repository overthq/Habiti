import React from 'react';
import { Screen } from '@habiti/components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import OrdersList from '../components/orders/OrdersList';
import { OrdersProvider } from '../components/orders/OrdersContext';
import OrdersScreenHeader from '../components/orders/OrdersScreenHeader';

const Orders: React.FC = () => {
	const { top } = useSafeAreaInsets();

	return (
		<OrdersProvider>
			<Screen style={{ paddingTop: top }}>
				<OrdersScreenHeader />
				<OrdersList />
			</Screen>
		</OrdersProvider>
	);
};

export default Orders;
