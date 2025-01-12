import { Screen, ScreenHeader } from '@habiti/components';
import React from 'react';
import { View } from 'react-native';

import OrdersFilter from '../components/orders/OrdersFilter';
import OrdersList from '../components/orders/OrdersList';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Orders: React.FC = () => {
	const { top } = useSafeAreaInsets();

	return (
		<Screen style={{ paddingTop: top }}>
			<ScreenHeader title='Orders' />
			<OrdersFilter />
			<View style={{ flex: 1 }}>
				<OrdersList />
			</View>
		</Screen>
	);
};

export default Orders;
