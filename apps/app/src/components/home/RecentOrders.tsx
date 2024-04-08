import { ListEmpty, Typography } from '@market/components';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import React from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';

import RecentOrder from './RecentOrder';
import { HomeQuery } from '../../types/api';
import { HomeStackParamList, HomeTabParamList } from '../../types/navigation';

interface RecentOrdersProps {
	orders: HomeQuery['currentUser']['orders'];
}

// This should only query the last three orders.
// We should have a "view all" button that navigates to a more in-depth view
// (infinite scrolling and filters) of all previous orders.

const RecentOrders: React.FC<RecentOrdersProps> = ({ orders }) => {
	const { navigate } =
		useNavigation<NavigationProp<HomeTabParamList & HomeStackParamList>>();

	const handleOrderPress = React.useCallback(
		(orderId: string) => () => {
			navigate('Order', { orderId });
		},
		[]
	);

	return (
		<View style={styles.container}>
			<Typography weight='medium' style={{ marginLeft: 16, marginBottom: 8 }}>
				Recent Orders
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

interface NewHorizontalItemProps {
	order: HomeQuery['currentUser']['orders'][number];
	onPress(): void;
}

const NewHorizontalItem: React.FC<NewHorizontalItemProps> = ({
	order,
	onPress
}) => {
	return <Pressable />;
};

const NewHorizontal: React.FC<RecentOrdersProps> = ({ orders }) => {
	const { navigate } =
		useNavigation<NavigationProp<HomeTabParamList & HomeStackParamList>>();

	const handleOrderPress = React.useCallback(
		(orderId: string) => () => {
			navigate('Order', { orderId });
		},
		[]
	);

	return (
		<View style={styles.container}>
			<Typography weight='medium' style={{ marginLeft: 16, marginBottom: 8 }}>
				Recent Orders
			</Typography>
			<ScrollView horizontal>
				{orders.map(order => (
					<NewHorizontalItem
						key={order.id}
						order={order}
						onPress={handleOrderPress(order.id)}
					/>
				))}
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingTop: 16
	}
});

export default RecentOrders;
