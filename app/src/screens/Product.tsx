import React from 'react';
import { View, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useProductQuery } from '../types/api';
import { AppStackParamList } from '../types/navigation';
import ImageCarousel from '../components/product/ImageCarousel';
import AddToCart from '../components/product/AddToCart';
import ProductDetails from '../components/product/ProductDetails';

const Product: React.FC = () => {
	const { params } = useRoute<RouteProp<AppStackParamList, 'Product'>>();
	const [{ data, fetching }] = useProductQuery({
		variables: { productId: params.productId }
	});

	const { product, cart } = React.useMemo(
		() => ({
			product: data?.product,
			cart: data?.product.store.cartForUser
		}),
		[data]
	);

	if (fetching || !product) {
		return (
			<View>
				<ActivityIndicator />
			</View>
		);
	}

	return (
		<ScrollView style={styles.container}>
			<ImageCarousel images={product.images} />
			<ProductDetails product={product} />
			<AddToCart
				storeId={product.storeId}
				productId={product.id}
				cartId={cart?.id}
				inCart={product.inCart}
			/>
			{/* Related Products */}
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	buttonContainer: {
		width: '100%',
		marginVertical: 16,
		paddingHorizontal: 16
	},

	button: {
		width: '100%'
	}
});

export default Product;
