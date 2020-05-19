import React from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	FlatList,
	StyleSheet
} from 'react-native';
import { useUserOrdersQuery, OrderStatus } from '../types';

const getStatusColor = (status: OrderStatus) => {
	switch (status) {
		case OrderStatus.Pending:
			return '#F4CF0B';
		case OrderStatus.Processing:
			return '#C4C4C4';
		case OrderStatus.Delivered:
			return '#37DB0F';
	}
};

const RecentOrders = () => {
	const [{ data }] = useUserOrdersQuery();

	return (
		<FlatList
			data={data?.userOrders}
			keyExtractor={({ _id }) => _id}
			horizontal
			renderItem={({ item }) => (
				<TouchableOpacity activeOpacity={0.8} key={item._id}>
					<View style={styles.orderContainer}>
						<View style={styles.storeAvatar}></View>
						<View style={styles.orderInformation}>
							<Text>{item.cart[0].item.name}</Text>
							<Text>
								{item.cart.length > 1 && ` (and ${item.cart.length} others)`}
							</Text>
							<Text style={{ color: getStatusColor(item.status) }}>
								{item.status}
							</Text>
						</View>
					</View>
				</TouchableOpacity>
			)}
		/>
	);
};

const styles = StyleSheet.create({
	orderContainer: {
		flexDirection: 'row'
	},
	storeAvatar: {
		height: 50,
		width: 50,
		borderRadius: 25,
		backgroundColor: '#D3D3D3'
	},
	orderInformation: {
		marginLeft: 10
	}
});

export default RecentOrders;
