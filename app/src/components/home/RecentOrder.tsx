import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { UserOrdersQuery } from '../../types/api';

interface RecentOrderProps {
	order: UserOrdersQuery['currentUser']['orders'][-1];
}

const RecentOrder: React.FC<RecentOrderProps> = ({ order }) => {
	const count = order.products.length;

	return (
		<TouchableOpacity
			activeOpacity={0.8}
			key={order.id}
			style={styles.container}
		>
			<View style={styles.avatar} />
			<View style={styles.info}>
				<Text>{order.store.name}</Text>
				<Text style={styles.text}>{count} products</Text>
				<Text style={styles.text}>{order.createdAt}</Text>
				{/* <Text style={styles.status}>{order.status}</Text> */}
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		marginLeft: 16,
		flexDirection: 'row',
		alignItems: 'center',
		borderColor: 'red'
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
