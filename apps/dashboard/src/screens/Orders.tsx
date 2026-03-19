import React from 'react';
import { Pressable } from 'react-native';
import { Icon, Screen, ScreenHeader } from '@habiti/components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import OrdersList from '../components/orders/OrdersList';
import OrderStatusPills from '../components/orders/OrderStatusPills';
import {
	OrdersProvider,
	useOrdersContext
} from '../components/orders/OrdersContext';

const Orders: React.FC = () => {
	const { top } = useSafeAreaInsets();

	const { openFilterModal } = useOrdersContext();

	return (
		<Screen style={{ paddingTop: top }}>
			<ScreenHeader
				title='Orders'
				right={
					<Pressable onPress={openFilterModal}>
						<Icon name='sliders-horizontal' size={20} />
					</Pressable>
				}
				hasBottomBorder
			>
				<OrderStatusPills />
			</ScreenHeader>
			<OrdersList />
		</Screen>
	);
};

const OrdersWrapper = () => {
	return (
		<OrdersProvider>
			<Orders />
		</OrdersProvider>
	);
};

export default OrdersWrapper;
