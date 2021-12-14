import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useOrderQuery } from '../types/api';
import { AppStackParamList } from '../types/navigation';

const Order = () => {
	const {
		params: { orderId }
	} = useRoute<RouteProp<AppStackParamList, 'Order'>>();

	const [{ data, fetching }] = useOrderQuery({ variables: { orderId } });

	if (fetching) {
		return (
			<View>
				<Text>Loading</Text>
			</View>
		);
	}

	const order = data?.order;

	return (
		<SafeAreaView style={styles.container}>
			<Text>Order Details:</Text>
			<Text>{order?.id}</Text>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

export default Order;
