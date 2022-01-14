import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { UserOrdersQuery } from '../../types/api';
import { AppStackParamList } from '../../types/navigation';
import { relativeTimestamp } from '../../utils/date';

interface RecentOrderProps {
	order: UserOrdersQuery['currentUser']['orders'][-1];
}

const RecentOrder: React.FC<RecentOrderProps> = ({ order }) => {
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();
	const count = order.products.length;

	const handleOrderPress = React.useCallback((orderId: string) => {
		navigate('Order', { orderId, storeId: order.store.id });
	}, []);

	return (
		<TouchableOpacity
			activeOpacity={0.8}
			key={order.id}
			style={styles.container}
			onPress={() => handleOrderPress(order.id)}
		>
			<View style={styles.avatar}>
				{order.store.image && (
					<Image
						style={styles.image}
						source={{
							uri: order.store.image.path
						}}
					/>
				)}
			</View>
			<View style={styles.info}>
				<Text style={styles.name}>{order.store.name}</Text>
				<Text style={styles.count}>
					{count} product{count > 1 ? 's' : ''}
				</Text>
				<Text style={styles.date}>{relativeTimestamp(order.createdAt)}</Text>
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
