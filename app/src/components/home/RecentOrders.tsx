import React from 'react';
import {
	View,
	Text,
	FlatList,
	ActivityIndicator,
	StyleSheet
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useUserOrdersQuery } from '../../types/api';
import textStyles from '../../styles/text';
import RecentOrder from './RecentOrder';
import ListEmpty from '../global/ListEmpty';
import { HomeTabParamList } from '../../types/navigation';

const RecentOrders: React.FC = () => {
	const [{ data, fetching }] = useUserOrdersQuery();
	const { navigate } = useNavigation<NavigationProp<HomeTabParamList>>();
	const orders = data?.currentUser.orders;

	return (
		<View style={styles.container}>
			<Text style={[textStyles.sectionHeader, { marginLeft: 16 }]}>
				Recent Orders
			</Text>
			{fetching ? (
				<View style={styles.loading}>
					<ActivityIndicator />
				</View>
			) : !orders || orders?.length === 0 ? (
				<ListEmpty
					description='When you have pending orders, they will be displayed here.'
					cta={{
						text: 'View your carts',
						action: () => navigate('Carts')
					}}
				/>
			) : (
				<FlatList
					data={orders}
					keyExtractor={({ id }) => id}
					horizontal
					showsHorizontalScrollIndicator={false}
					renderItem={({ item }) => <RecentOrder order={item} />}
				/>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingVertical: 8
	},
	loading: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	}
});

export default RecentOrders;
