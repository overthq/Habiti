import React from 'react';
import {
	View,
	Text,
	ScrollView,
	StyleSheet,
	ActivityIndicator
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useOrderQuery } from '../types/api';
import { OrdersStackParamsList } from '../types/navigation';
import useGoBack from '../hooks/useGoBack';
import { formatNaira } from '../utils/currency';
import { parseTimestamp } from '../utils/date';
import OrderProducts from '../components/order/OrderProducts';

const Order: React.FC = () => {
	const {
		params: { orderId }
	} = useRoute<RouteProp<OrdersStackParamsList, 'Order'>>();
	const [{ data, fetching }] = useOrderQuery({ variables: { id: orderId } });
	useGoBack();

	if (fetching) {
		return (
			<View>
				<ActivityIndicator />
			</View>
		);
	}

	if (!data?.order) {
		return (
			<View>
				<Text>An error has occured.</Text>
			</View>
		);
	}

	return (
		<ScrollView style={styles.container}>
			<View style={{ paddingLeft: 16 }}>
				<Text style={styles.name}>{data?.order?.user.name}</Text>
				<Text>{data?.order?.status}</Text>
				<Text>Date: {parseTimestamp(data?.order.createdAt)}</Text>
			</View>

			<OrderProducts products={data.order.products} />

			<View style={{ marginTop: 8, paddingLeft: 16 }}>
				<Text style={{ fontSize: 16 }}>
					Total: {formatNaira(data?.order?.total ?? 0)}
				</Text>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FFFFFF'
	},
	name: {
		fontSize: 16,
		marginVertical: 16
	},
	sectionHeader: {
		fontSize: 16,
		fontWeight: '500',
		marginVertical: 4
	}
});

export default Order;
