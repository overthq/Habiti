import { Icon, Screen, Spacer } from '@habiti/components';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { GestureHandlerRefContext } from '@react-navigation/stack';
import React from 'react';
import { View, Pressable, ScrollViewProps } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import AddToCart from '../components/product/AddToCart';
import ImageCarousel from '../components/product/ImageCarousel';
import ProductDetails from '../components/product/ProductDetails';
import RelatedProducts from '../components/product/RelatedProducts';
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

	const handleScroll = React.useCallback<
		NonNullable<ScrollViewProps['onScroll']>
	>(({ nativeEvent }) => {
		setScrolledTop(nativeEvent.contentOffset.y <= 0);
	}, []);

	useGoBack('x');

	React.useLayoutEffect(() => {
		setOptions({ headerShadowVisible: !scrolledTop });
	}, [scrolledTop]);

	React.useLayoutEffect(() => {
		setOptions({
			headerRight: () => (
				<Pressable>
					<Icon name='bookmark' />
				</Pressable>
			)
		});
	}, []);

	if (fetching || !data?.product) {
		return <View />;
	}

	return (
		<Screen>
			<GestureHandlerRefContext.Consumer>
				{ref => (
					<ScrollView
						waitFor={scrolledTop ? ref : undefined}
						onScroll={handleScroll}
						scrollEventThrottle={16}
					>
						<ImageCarousel images={data.product.images} />
						<Spacer y={16} />
						<ProductDetails product={data.product} />
						<Spacer y={16} />
						<RelatedProducts products={data.product.relatedProducts} />
						<Spacer y={120} />
					</ScrollView>
				)}
			</GestureHandlerRefContext.Consumer>
			<AddToCart
				storeId={data.product.storeId}
				productId={data.product.id}
				cartId={data.product.store.userCart?.id}
				inCart={data.product.inCart}
			/>
		</Screen>
	);
};

export default Product;
