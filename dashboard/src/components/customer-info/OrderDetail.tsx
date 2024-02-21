import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CustomerInfoQuery } from '../../types/api';
import { formatNaira } from '../../utils/currency';
import Typography from '../global/Typography';
import CustomImage from '../global/CustomImage';

interface OrderDetailProps {
	order: CustomerInfoQuery['user']['orders'][number];
}

const OrderDetail: React.FC<OrderDetailProps> = ({ order }) => {
	return (
		<View style={styles.container}>
			<View style={styles.row}>
				{order.products.slice(0, 3).map(product => (
					<View key={product.id} style={styles.item}>
						<CustomImage height={80} width={80} />
						{/* <Typography>{product.product.name}</Typography> */}
					</View>
				))}
			</View>
			<Typography weight='bold'>{formatNaira(order.total)}</Typography>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginBottom: 8
	},
	row: {
		flexDirection: 'row',
		marginBottom: 4
	},
	item: {
		marginRight: 8
	}
});

export default OrderDetail;
