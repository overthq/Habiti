import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { GestureHandlerRefContext } from '@react-navigation/stack';
import { ScrollView } from 'react-native-gesture-handler';

import ImageCarousel from '../components/product/ImageCarousel';
import AddToCart from '../components/product/AddToCart';
import ProductDetails from '../components/product/ProductDetails';

import { useProductQuery } from '../types/api';
import { AppStackParamList } from '../types/navigation';
import useGoBack from '../hooks/useGoBack';
import { Icon } from '../components/Icon';

const Product: React.FC = () => {
	const { setOptions } = useNavigation();
	const { params } = useRoute<RouteProp<AppStackParamList, 'Product'>>();
	const [{ data, fetching }] = useProductQuery({
		variables: { productId: params.productId }
	});
	const [scrolledTop, setScrolledTop] = React.useState(true);

	const handleScroll = React.useCallback(({ nativeEvent }: any) => {
		setScrolledTop(nativeEvent.contentOffset.y <= 0);
	}, []);

	useGoBack('x', 16);

	React.useLayoutEffect(() => {
		setOptions({ headerShadowVisible: !scrolledTop });
	}, [scrolledTop]);

	React.useLayoutEffect(() => {
		setOptions({
			headerRight: () => (
				<View style={{ marginRight: 16 }}>
					<Pressable>
						<Icon name='bookmark' />
					</Pressable>
				</View>
			)
		});
	}, []);

	if (fetching || !data?.product) {
		return <View />;
	}

	return (
		<GestureHandlerRefContext.Consumer>
			{ref => (
				<ScrollView
					waitFor={scrolledTop ? ref : undefined}
					onScroll={handleScroll}
					scrollEventThrottle={16}
					style={styles.container}
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

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#FFFFFF'
	}
});

export default Product;
