import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { UserOrdersQuery } from '../../types/api';

interface RecentOrderProps {
	order: UserOrdersQuery['orders'][-1];
}

const getStatusColor = (status?: string | null) => {
	// switch (status) {
	// 	case OrderStatus.Pending:
	// 		return '#ba9b03';
	// 	case OrderStatus.Processing:
	// 		return '#C4C4C4';
	// 	case OrderStatus.Fulfilled:
	// 		return '#7dba03';
	// }
	if (status) {
		return 'gray';
	}
};

const RecentOrder: React.FC<RecentOrderProps> = ({ order }) => {
	const nameText = order.order_items[0]?.item.name;
	const itemsLength = order.order_items.length;

	return (
		<TouchableOpacity
			activeOpacity={0.8}
			key={order.id}
			style={styles.orderContainer}
		>
			<View style={styles.storeAvatar} />
			<View style={styles.orderInformation}>
				<Text style={{ fontSize: 16 }}>
					{nameText}
					{itemsLength > 1 &&
						` and ${itemsLength - 1} ${itemsLength > 2 ? 'others' : 'other'}`}
				</Text>
				<Text
					style={{
						fontSize: 14,
						fontWeight: '500',
						color: getStatusColor(order.status)
					}}
				>
					{order.status}
				</Text>
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	orderContainer: {
		marginLeft: 16,
		flexDirection: 'row',
		alignItems: 'center'
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

export default RecentOrder;
