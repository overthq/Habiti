import React from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useUserOrdersQuery } from '../../types/api';
import textStyles from '../../styles/text';
import RecentOrder from './RecentOrder';
import ListEmpty from '../global/ListEmpty';
import { HomeTabParamList } from '../../types/navigation';

const RecentOrders = () => {
	const [{ data, fetching }] = useUserOrdersQuery();
	const { navigate } = useNavigation<NavigationProp<HomeTabParamList>>();

	return (
		<View style={{ height: 250 }}>
			<Text style={[textStyles.sectionHeader, { marginLeft: 16 }]}>
				Recent Orders
			</Text>
			{fetching ? (
				<View
					style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
				>
					<ActivityIndicator />
				</View>
			) : data?.currentUser.orders.length === 0 ? (
				<ListEmpty
					description='When you have pending orders, they will be displayed here.'
					cta={{
						text: 'View your carts',
						action: () => navigate('Carts')
					}}
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
