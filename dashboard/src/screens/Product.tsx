import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useProductQuery } from '../types/api';
import { ProductsStackParamList } from '../types/navigation';
import Section from '../components/item/Section';
// import Images from '../components/item/Images';

const Item: React.FC = () => {
	const {
		params: { productId }
	} = useRoute<RouteProp<ProductsStackParamList, 'Item'>>();
	const [{ data, fetching }] = useProductQuery({
		variables: { id: productId }
	});

	const product = data?.product;

	if (fetching) return <ActivityIndicator />;
	if (!product) throw new Error('This item does not exist');

	return (
		<View style={styles.container}>
			<View style={styles.heading}>
				<Text style={styles.title}>{product.name}</Text>
			</View>
			{/* <Images itemId={productId} images={product.item_images} /> */}
			<Section title='Name' content={product.name} />
			<Section title='Description' content={product.description} />
			<Section title='Unit Price' content={`${product.unitPrice} NGN`} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	heading: {
		marginVertical: 8,
		paddingLeft: 16
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold'
	}
});

export default Item;
