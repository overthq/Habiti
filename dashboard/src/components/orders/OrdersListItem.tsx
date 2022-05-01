import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { OrdersQuery } from '../../types/api';
import { Icon } from '../Icon';
import { OrdersStackParamsList } from '../../types/navigation';
import { formatNaira } from '../../utils/currency';
import { parseTimestamp } from '../../utils/date';

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
				<Text style={styles.date}>{parseTimestamp(order.createdAt)}</Text>
			</View>
			<View style={styles.right}>
				<Text style={styles.total}>{formatNaira(order.total)}</Text>
				<Icon name='chevron-right' />
			</View>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {
		width: '100%',
		paddingVertical: 8,
		paddingLeft: 16,
		paddingRight: 8,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: '#FFFFFF',
		borderBottomWidth: 0.5,
		borderBottomColor: '#EDEDED'
	},
	right: {
		flexDirection: 'row'
	},
	name: {
		fontSize: 17,
		fontWeight: '500'
	},
	date: {
		fontSize: 16,
		marginTop: 4,
		color: '#505050'
	},
	total: {
		fontSize: 18,
		fontWeight: '500'
	}
});

export default OrdersListItem;
