import React from 'react';
import { View, Text, StyleSheet, FlatList, ListRenderItem } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import OrderProduct from './OrderProduct';
import { OrderQuery } from '../../types/api';
import { ProductsStackParamList } from '../../types/navigation';

interface OrderProductsProps {
	products: OrderQuery['order']['products'];
}

const OrderProducts: React.FC<OrderProductsProps> = ({ products }) => {
	const { navigate } = useNavigation<NavigationProp<ProductsStackParamList>>();

	const handlePress = React.useCallback(
		(productId: string) => () => {
			navigate('Product', { productId });
		},
		[]
	);

	const renderOrderProduct: ListRenderItem<
		OrderQuery['order']['products'][number]
	> = React.useCallback(({ item }) => {
		return (
			<OrderProduct onPress={handlePress(item.productId)} orderProduct={item} />
		);
	}, []);

	return (
		<View style={styles.container}>
			<Text style={styles.sectionHeader}>Products</Text>
			<FlatList
				horizontal
				data={products}
				keyExtractor={item => item.id}
				contentContainerStyle={styles.content}
				renderItem={renderOrderProduct}
				showsHorizontalScrollIndicator={false}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingVertical: 12
	},
	content: {
		paddingLeft: 16
	},
	sectionHeader: {
		fontSize: 16,
		fontWeight: '500',
		marginLeft: 16,
		marginBottom: 8
	}
});

export default OrderProducts;
