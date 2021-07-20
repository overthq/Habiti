import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { UserOrdersQuery } from '../../types/api';

interface RecentOrderProps {
	order: UserOrdersQuery['orders'][-1];
}

const RecentOrder: React.FC<RecentOrderProps> = ({ order }) => {
	const name = order.order_items[0]?.item.name;
	const itemsLength = order.order_items.length;

	return (
		<TouchableOpacity
			activeOpacity={0.8}
			key={order.id}
			style={styles.container}
		>
			<View style={styles.avatar} />
			<View style={styles.info}>
				<Text style={styles.text}>
					{name}
					{itemsLength > 1 &&
						` and ${itemsLength - 1} ${itemsLength > 2 ? 'others' : 'other'}`}
				</Text>
				<Text style={styles.status}>{order.status}</Text>
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		marginLeft: 16,
		flexDirection: 'row',
		alignItems: 'center'
	},
	avatar: {
		height: 50,
		width: 50,
		borderRadius: 25,
		backgroundColor: '#D3D3D3'
	},
	text: {
		fontSize: 16
	},
	info: {
		marginLeft: 10
	},
	status: {
		fontSize: 14,
		fontWeight: '500',
		color: 'gray'
	}
});

export default RecentOrder;
