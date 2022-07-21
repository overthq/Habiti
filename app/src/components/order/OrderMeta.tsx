import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { OrderQuery } from '../../types/api';
import { AppStackParamList } from '../../types/navigation';
import { relativeTimestamp } from '../../utils/date';
import { formatNaira } from '../../utils/currency';
import { Icon } from '../Icon';

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
			</Pressable>
			<View
				style={{
					marginTop: 8,
					flexDirection: 'row'
				}}
			>
				<View style={{ flexGrow: 1 }}>
					<Text style={styles.label}>Order Date</Text>
					<Text style={styles.date}>{relativeTimestamp(order.createdAt)}</Text>
				</View>
				<View style={{ flexGrow: 1 }}>
					<Text style={styles.label}>Order Total</Text>
					<Text style={styles.date}>{formatNaira(order.total)}</Text>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#FFFFFF',
		padding: 16,
		borderRadius: 4,
		marginVertical: 16,
		marginHorizontal: 16
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
		fontSize: 16,
		fontWeight: '500'
	},
	date: {
		fontSize: 16,
		color: '#505050'
	}
});

export default OrderMeta;
