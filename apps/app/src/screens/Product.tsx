import { Icon, useTheme } from '@market/components';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { GestureHandlerRefContext } from '@react-navigation/stack';
import React from 'react';
import { View, Pressable, ScrollViewProps } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import AddToCart from '../components/product/AddToCart';
import ImageCarousel from '../components/product/ImageCarousel';
import ProductDetails from '../components/product/ProductDetails';
// import RelatedProducts from '../components/product/RelatedProducts';
import ProductReviews from '../components/product/ProductReviews';
import useGoBack from '../hooks/useGoBack';
import { useProductQuery } from '../types/api';
import { AppStackParamList } from '../types/navigation';

const Product: React.FC = () => {
	const { setOptions } = useNavigation();
	const { params } = useRoute<RouteProp<AppStackParamList, 'Product'>>();
	const [{ data, fetching }] = useProductQuery({
		variables: { productId: params.productId }
	});
	const [scrolledTop, setScrolledTop] = React.useState(true);
	const { theme } = useTheme();

	const handleScroll = React.useCallback<
		NonNullable<ScrollViewProps['onScroll']>
	>(({ nativeEvent }) => {
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
					style={{ backgroundColor: theme.screen.background }}
				>
					<ImageCarousel images={data.product.images} />
					<ProductDetails product={data.product} />
					<ProductReviews reviews={data.product.reviews} />
					{/* <RelatedProducts /> */}
					<AddToCart
						storeId={data.product.storeId}
						productId={data.product.id}
						cartId={data.product.store.cartId}
						inCart={data.product.inCart}
					/>
				</ScrollView>
			)}
		</GestureHandlerRefContext.Consumer>
	);
};

export default Product;
