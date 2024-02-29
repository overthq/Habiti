import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { HomeQuery } from '../../types/api';
import { relativeTimestamp } from '../../utils/date';
import { plural } from '../../utils/strings';

interface RecentOrderProps {
	order: HomeQuery['currentUser']['orders'][-1];
	onPress(): void;
}

// TODO: Remove the store name from its prominent spot.
// Replace it with the name of the first item in the order
// Something like: "Nike Air Force 1s + 2 others" (ellipsis necessary).
// (Or maybe the most expensive one?)
// Make the date relative. (e.g. "2 days ago")

const RecentOrder: React.FC<RecentOrderProps> = ({ order, onPress }) => {
	return (
		<TouchableOpacity
			activeOpacity={0.8}
			key={order.id}
			style={styles.container}
			onPress={onPress}
		>
			<View style={styles.avatar}>
				<Image style={styles.image} source={{ uri: order.store.image?.path }} />
			</View>
			<View style={styles.info}>
				<Text style={styles.name}>{order.store.name}</Text>
				<Text style={styles.count}>
					{plural('product', order.products.length)} ·{' '}
					{relativeTimestamp(order.createdAt)}
				</Text>
				<Text style={styles.status}>{order.status}</Text>
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		width: '100%',
		marginLeft: 16,
		flexDirection: 'row',
		alignItems: 'center',
		borderColor: 'red',
		marginBottom: 8
	},
	avatar: {
		height: 50,
		width: 50,
		borderRadius: 25,
		backgroundColor: '#D3D3D3',
		overflow: 'hidden'
	},
	image: {
		width: '100%',
		height: '100%'
	},
	name: {
		fontSize: 16,
		fontWeight: '500'
	},
	count: {
		fontSize: 14
	},
	date: {
		fontSize: 14,
		color: '#505050'
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
