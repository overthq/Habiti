import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useOrdersQuery } from '../../types/api';
import { HomeStackParamList } from '../../types/navigation';
import TextButton from '../global/TextButton';

const PendingOrders = () => {
	const [{ data }] = useOrdersQuery();
	const { navigate } = useNavigation<NavigationProp<HomeStackParamList>>();

	const navigateToOrder = React.useCallback(
		(orderId: string) => () => {
			navigate('Order', { orderId });
		},
		[]
	);

	return (
		<View style={styles.container}>
			<View style={styles.heading}>
				<Text style={styles.title}>Pending Orders</Text>
				<TextButton>View all</TextButton>
			</View>
			{data?.currentStore.orders.map(order => (
				<Pressable key={order.id} onPress={navigateToOrder(order.id)}>
					<Text>{order.user.name}</Text>
				</Pressable>
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 16
	},
	heading: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 4
	},
	title: {
		fontSize: 16,
		fontWeight: '500',
		color: '#505050'
	}
});

export default PendingOrders;
