import { Typography } from '@habiti/components';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import React from 'react';
import { View, StyleSheet } from 'react-native';

import RecentOrder from './RecentOrder';
import { HomeQuery } from '../../types/api';
import { HomeStackParamList, MainTabParamList } from '../../types/navigation';

interface RecentOrdersProps {
	orders: HomeQuery['currentUser']['orders'];
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

	if (!orders || orders.length === 0) {
		return null;
	}

	return (
		<View style={styles.container}>
			<Typography
				preset='sectionHeader'
				style={{ marginLeft: 16, marginBottom: 8 }}
			>
				Recent orders
			</Typography>
			{orders.map(order => (
				<RecentOrder
					key={order.id}
					order={order}
					onPress={handleOrderPress(order.id)}
				/>
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingTop: 8
	}
});

export default RecentOrders;
