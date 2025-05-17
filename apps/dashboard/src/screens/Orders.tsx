import { Screen, ScreenHeader } from '@habiti/components';
import React from 'react';

import OrdersList from '../components/orders/OrdersList';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Orders: React.FC = () => {
	const { top } = useSafeAreaInsets();

	return (
		<Screen style={{ paddingTop: top }}>
			<ScreenHeader title='Orders' />
			<OrdersList />
		</Screen>
	);
};

export default Orders;
