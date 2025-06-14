import React from 'react';
import { View } from 'react-native';
import { ScrollableScreen, Spacer } from '@habiti/components';
import { useRoute, RouteProp } from '@react-navigation/native';

import AddToCart from '../components/product/AddToCart';
import ImageCarousel from '../components/product/ImageCarousel';
import ProductDetails from '../components/product/ProductDetails';
import RelatedProducts from '../components/product/RelatedProducts';
import useGoBack from '../hooks/useGoBack';
import { useProductQuery } from '../types/api';
import { AppStackParamList } from '../types/navigation';

const Product: React.FC = () => {
	const { params } = useRoute<RouteProp<AppStackParamList, 'Product'>>();
	const [{ data, fetching }] = useProductQuery({
		variables: { productId: params.productId }
	});

	useGoBack('x');

	if (fetching || !data?.product) {
		return <View />;
	}

	return (
		<View style={{ flex: 1 }}>
			<ScrollableScreen>
				<ImageCarousel images={data.product.images} />
				<Spacer y={16} />
				<ProductDetails product={data.product} />
				<Spacer y={16} />
				<RelatedProducts products={data.product.relatedProducts} />
				<Spacer y={16} />
			</ScrollableScreen>
			<AddToCart
				storeId={data.product.storeId}
				productId={data.product.id}
				cartId={data.product.store.userCart?.id}
				inCart={data.product.inCart}
				quantity={
					data.product.store.userCart?.products.find(
						p => p.productId === data.product.id
					)?.quantity
				}
			/>
		</View>
	);
};

export default Product;
