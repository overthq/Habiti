import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { OrderQuery } from '../../types/api';
import { relativeTimestamp } from '../../utils/date';
import { formatNaira } from '../../utils/currency';

interface OrderMetaProps {
	order: OrderQuery['order'];
}

const OrderMeta: React.FC<OrderMetaProps> = ({ order }) => {
	// const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();

	// const handleStorePress = React.useCallback(() => {
	// 	navigate('Store', { storeId: order.store.id });
	// }, [order]);

	return (
		<View style={styles.container}>
			{/* <Pressable style={styles.store} onPress={handleStorePress}>
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<View style={styles.placeholder}>
						{order.store.image ? (
							<Image
								style={styles.image}
								source={{ uri: order.store.image.path }}
							/>
						) : (
							<Text style={styles.avatarText}>{order.store.name[0]}</Text>
						)}
					</View>
					<Text style={styles.storeName}>{order.store.name}</Text>
				</View>
				<Icon name='chevron-right' />
			</Pressable> */}
			<View style={styles.row}>
				<Text style={styles.label}>Date</Text>
				<Text style={styles.date}>{relativeTimestamp(order.createdAt)}</Text>
			</View>
			<View style={styles.row}>
				<Text style={styles.label}>Total</Text>
				<Text style={styles.date}>{formatNaira(order.total)}</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#FFFFFF',
		paddingTop: 8,
		paddingBottom: 4,
		paddingHorizontal: 16,
		borderRadius: 4,
		marginVertical: 16,
		marginHorizontal: 16
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 4
	},
	store: {
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingBottom: 8,
		borderBottomColor: '#D3D3D3',
		borderBottomWidth: 1
	},
	storeName: {
		fontSize: 18,
		fontWeight: '500'
	},
	placeholder: {
		height: 36,
		width: 36,
		borderRadius: 20,
		backgroundColor: '#D3D3D3',
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 8
	},
	image: {
		width: '100%',
		height: '100%'
	},
	avatarText: {
		fontSize: 20,
		fontWeight: '500',
		color: '#505050'
	},
	label: {
		fontSize: 16
	},
	date: {
		fontSize: 16,
		color: '#505050'
	}
});

export default OrderMeta;
