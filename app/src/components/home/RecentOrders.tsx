import React from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { useUserOrdersQuery } from '../../types/api';
import textStyles from '../../styles/text';
import RecentOrder from './RecentOrder';
import ListEmpty from '../global/ListEmpty';

const RecentOrders = () => {
	const [{ data, fetching }] = useUserOrdersQuery();

	return (
		<View>
			<Text style={[textStyles.sectionHeader, { marginLeft: 16 }]}>
				Recent Orders
			</Text>
			{fetching ? (
				<View>
					<ActivityIndicator />
				</View>
			) : data?.currentUser.orders.length === 0 ? (
				<ListEmpty
					title='No recent orders to view'
					description='When you have pending orders, they will be displayed here.'
				/>
			) : (
				<FlatList
					data={data?.currentUser.orders}
					keyExtractor={({ id }) => id}
					horizontal
					showsHorizontalScrollIndicator={false}
					renderItem={({ item }) => <RecentOrder order={item} />}
				/>
			)}
		</View>
	);
};

export default RecentOrders;
