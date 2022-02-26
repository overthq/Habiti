import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { OrderQuery } from '../../types/api';
import { AppStackParamList } from '../../types/navigation';
import { relativeTimestamp } from '../../utils/date';

interface OrderMetaProps {
	order: OrderQuery['order'];
}

const OrderMeta: React.FC<OrderMetaProps> = ({ order }) => {
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();
	const handleStorePress = React.useCallback(() => {
		navigate('Store', { storeId: order.store.id });
	}, [order]);

	return (
		<View style={styles.container}>
			<Pressable style={styles.store} onPress={handleStorePress}>
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
			</Pressable>
			<Text>{relativeTimestamp(order.createdAt)}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 16,
		borderRadius: 4,
		marginHorizontal: 16
	},
	store: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	storeName: {
		fontSize: 18,
		fontWeight: '500'
	},
	placeholder: {
		height: 40,
		width: 40,
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
		fontSize: 24,
		fontWeight: '500',
		color: '#505050'
	}
});

export default OrderMeta;
