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
			{order.products.map(product => (
				<View key={product.id}>
					<CustomImage size={200} />
					<Typography>{product.product.name}</Typography>
				</View>
			))}
			<Typography>{formatNaira(order.total)}</Typography>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 16
	}
});

export default OrderDetail;
