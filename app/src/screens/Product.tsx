import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { GestureHandlerRefContext } from '@react-navigation/stack';
import { ScrollView } from 'react-native-gesture-handler';

import ImageCarousel from '../components/product/ImageCarousel';
import AddToCart from '../components/product/AddToCart';
import ProductDetails from '../components/product/ProductDetails';

import { useProductQuery } from '../types/api';
import { AppStackParamList } from '../types/navigation';

const Product: React.FC = () => {
	const { params } = useRoute<RouteProp<AppStackParamList, 'Product'>>();
	const [{ data, fetching }] = useProductQuery({
		variables: { productId: params.productId }
	});
	const [scrolledTop, setScrolledTop] = React.useState(true);

	const handleScroll = React.useCallback(({ nativeEvent }: any) => {
		setScrolledTop(nativeEvent.contentOffset.y <= 0);
	}, []);

	if (fetching || !data?.product) {
		return (
			<View>
				<ActivityIndicator />
			</View>
		);
	}

	return (
		<GestureHandlerRefContext.Consumer>
			{ref => (
				<ScrollView
					// style={styles.container}
					waitFor={scrolledTop ? ref : undefined}
					onScroll={handleScroll}
					scrollEventThrottle={16}
				>
					<ImageCarousel images={data.product.images} />
					<ProductDetails product={data.product} />
					<AddToCart
						storeId={data.product.storeId}
						productId={data.product.id}
						cartId={data.product.store.cartId}
						inCart={data.product.inCart}
					/>
					{/* Related Products */}
				</ScrollView>
			)}
		</GestureHandlerRefContext.Consumer>
	);
};

// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1
// 	}
// });

export default Product;
