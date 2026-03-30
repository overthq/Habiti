import React from 'react';
import { View } from 'react-native';
import { SectionHeader, Spacer } from '@habiti/components';
import { useNavigation, NavigationProp } from '@react-navigation/native';

import RecentOrder from './RecentOrder';
import type { Order } from '../../data/types';
import { HomeStackParamList, MainTabParamList } from '../../types/navigation';

interface RecentOrdersProps {
	orders: Order[];
}

const RecentOrders: React.FC<RecentOrdersProps> = ({ orders }) => {
	const { navigate } =
		useNavigation<NavigationProp<MainTabParamList & HomeStackParamList>>();

	const handleOrderPress = React.useCallback(
		(orderId: string) => () => {
			navigate('Home.Order', { orderId });
		},
		[]
	);

	if (!orders || orders.length === 0) return null;

	return (
		<View>
			<SectionHeader
				title='Recent orders'
				padded
				action={{
					text: 'View all',
					onPress: () => navigate('Home.Orders')
				}}
			/>
			<Spacer y={4} />
			{orders.slice(0, 3).map(order => (
				<RecentOrder
					key={order.id}
					order={order}
					onPress={handleOrderPress(order.id)}
				/>
			))}
		</View>
	);
};

export default RecentOrders;
