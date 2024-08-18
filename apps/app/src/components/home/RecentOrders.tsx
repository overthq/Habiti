import { ListEmpty, Typography } from '@habiti/components';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import React from 'react';
import { View, StyleSheet } from 'react-native';

import RecentOrder from './RecentOrder';
import { HomeQuery } from '../../types/api';
import { HomeStackParamList, MainTabParamList } from '../../types/navigation';

interface RecentOrdersProps {
	orders: HomeQuery['currentUser']['orders'];
}

// This should only query the last three orders.
// We should have a "view all" button that navigates to a more in-depth view
// (infinite scrolling and filters) of all previous orders.

const RecentOrders: React.FC<RecentOrdersProps> = ({ orders }) => {
	const { navigate } =
		useNavigation<NavigationProp<MainTabParamList & HomeStackParamList>>();

	const handleOrderPress = React.useCallback(
		(orderId: string) => () => {
			navigate('Order', { orderId });
		},
		[]
	);

	return (
		<View style={styles.container}>
			<Typography
				preset='sectionHeader'
				style={{ marginLeft: 16, marginBottom: 8 }}
			>
				Recent orders
			</Typography>
			{!orders || orders?.length === 0 ? (
				<ListEmpty
					description='Pending orders will be displayed here.'
					cta={{
						text: 'View your carts',
						action: () => navigate('Carts')
					}}
				/>
			) : (
				orders.map(order => (
					<RecentOrder
						key={order.id}
						order={order}
						onPress={handleOrderPress(order.id)}
					/>
				))
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingTop: 16
	}
});

export default RecentOrders;
