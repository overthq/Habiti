import React from 'react';
import { View, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useProductQuery } from '../types/api';
import { AppStackParamList } from '../types/navigation';
import ImageCarousel from '../components/product/ImageCarousel';
import AddToCart from '../components/product/AddToCart';
import ProductDetails from '../components/product/ProductDetails';

const Item = () => {
	const { params } = useRoute<RouteProp<AppStackParamList, 'Product'>>();
	const [{ data, fetching }] = useProductQuery({
		variables: { productId: params.productId }
	});

	const item = data?.product;

	if (fetching) {
		return (
			<View>
				<ActivityIndicator />
			</View>
		);
	}

	if (!item) return <View />;

	return (
		<ScrollView style={styles.container}>
			{/* <ImageCarousel images={item.item_images} /> */}
			<ProductDetails item={item} />
			{/* Hack, create separate view for this. */}
			<View style={{ width: '100%', paddingHorizontal: 16 }}>
				<AddToCart
					storeId={item.store.id}
					itemId={item.id}
					cartId={item.store.carts[0]?.id}
				/>
			</View>
			{/* Related Items */}
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

export default Item;
