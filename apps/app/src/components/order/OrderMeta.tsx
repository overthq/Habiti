import { formatNaira } from '@habiti/common';
import { Typography } from '@habiti/components';
import React from 'react';
import { View, StyleSheet } from 'react-native';

import { OrderQuery } from '../../types/api';
import { relativeTimestamp } from '../../utils/date';

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
			<View style={styles.row}>
				<Typography>Date</Typography>
				<Typography variant='secondary'>
					{relativeTimestamp(order.createdAt)}
				</Typography>
			</View>
			<View style={styles.row}>
				<Typography>Total</Typography>
				<Typography variant='secondary'>{formatNaira(order.total)}</Typography>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingTop: 8,
		paddingBottom: 4,
		paddingHorizontal: 16,
		borderRadius: 4,
		marginVertical: 16
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
	placeholder: {
		height: 36,
		width: 36,
		borderRadius: 18,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 8
	}
});

export default OrderMeta;
