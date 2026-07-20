import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';

import OrderProduct from './OrderProduct';
import { OrdersStackParamList } from '../../navigation/types';
import { OrderProduct as OrderProductType } from '../../data/types';

interface OrderProductsProps {
	products: OrderProductType[];
}

const OrderProducts: React.FC<OrderProductsProps> = ({ products }) => {
	const { navigate } = useNavigation<NavigationProp<OrdersStackParamList>>();

	const handlePress = React.useCallback(
		(productId: string) => () => {
			navigate('Product', { screen: 'Product.Main', params: { productId } });
		},
		[navigate]
	);

	return (
		<View style={styles.container}>
			<Typography weight='medium' style={styles.sectionHeader}>
				Products
			</Typography>

			<View style={styles.list}>
				{products.map((p, index) => (
					<OrderProduct
						key={p.productId}
						onPress={handlePress(p.productId)}
						orderProduct={p}
						isLast={index === products.length - 1}
					/>
				))}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginVertical: 16
	},
	sectionHeader: {
		marginBottom: 8
	},
	list: {
		marginHorizontal: -16
	}
});

export default OrderProducts;
