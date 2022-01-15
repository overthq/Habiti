import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { OrdersQuery } from '../../types/api';
import { Icon } from '../icons';
import { OrdersStackParamsList } from '../../types/navigation';

interface OrdersListItemProps {
	order: OrdersQuery['store']['orders'][-1];
}

const OrdersListItem: React.FC<OrdersListItemProps> = ({ order }) => {
	const { navigate } = useNavigation<NavigationProp<OrdersStackParamsList>>();

	return (
		<Pressable
			onPress={() => navigate('Order', { orderId: order.id })}
			style={styles.container}
		>
			<View>
				<Text style={styles.name}>{order.user.name}</Text>
				{/*<Text>{order.status}</Text> */}
				<Text>{order.createdAt}</Text>
			</View>
			<Text>{order.total} NGN</Text>
			<Icon name='chevronRight' />
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {
		width: '100%',
		paddingVertical: 4,
		paddingHorizontal: 16,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: '#FFFFFF',
		borderBottomWidth: 0.5,
		borderBottomColor: '#EDEDED'
	},
	name: {
		fontSize: 18,
		fontWeight: '500'
	}
});

export default OrdersListItem;
