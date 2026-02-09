import { Typography } from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, StyleSheet } from 'react-native';

import OrderProduct from './OrderProduct';
import { ProductsStackParamList } from '../../types/navigation';
import { OrderProduct as OrderProductType } from '../../data/types';

interface OrderProductsProps {
	products: OrderProductType[];
}

const OrderProducts: React.FC<OrderProductsProps> = ({ products }) => {
	const { navigate } = useNavigation<NavigationProp<ProductsStackParamList>>();

	const handlePress = React.useCallback(
		(productId: string) => () => {
			navigate('Product', { screen: 'Product.Main', params: { productId } });
		},
		[]
	);

	return (
		<View style={styles.container}>
			<Typography weight='medium' style={styles.sectionHeader}>
				Products
			</Typography>

			{products.map(p => (
				<OrderProduct
					key={p.productId}
					onPress={handlePress(p.productId)}
					orderProduct={p}
				/>
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginVertical: 16
	},
	sectionHeader: {
		marginLeft: 16,
		marginBottom: 4
	}
});

export default OrderProducts;
