import React from 'react';
import { RefreshControl, View } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Spacer, useTheme, ScrollableScreen } from '@habiti/components';

import ProductDetails from '../components/product/ProductDetails';
import ProductMedia from '../components/product/ProductMedia';
import ProductCategories from '../components/product/ProductCategories';
import EditButtons from '../components/product/EditButtons';
import ProductMenu from '../components/product/ProductMenu';

import { useProductQuery } from '../data/queries';
import useRefresh from '../hooks/useRefresh';

import { ProductStackParamList } from '../types/navigation';

const Product = () => {
	const {
		params: { productId }
	} = useRoute<RouteProp<ProductStackParamList, 'Product.Main'>>();

	const { data, refetch } = useProductQuery(productId);
	const { isRefreshing, onRefresh } = useRefresh({ refetch });

	const { theme } = useTheme();

	if (!data?.product) {
		return <View />;
	}

	return (
		<ScrollableScreen
			refreshControl={
				<RefreshControl
					refreshing={isRefreshing}
					onRefresh={onRefresh}
					tintColor={theme.text.secondary}
				/>
			}
			showsVerticalScrollIndicator={true}
		>
			<Spacer y={16} />

			<ProductDetails product={data.product} />

			<Spacer y={16} />

			<EditButtons product={data.product} />

			<Spacer y={16} />

			<ProductMedia images={data.product.images} productId={productId} />

			<Spacer y={16} />

			<ProductCategories
				categories={data.product.categories}
				productId={productId}
			/>

			<ProductMenu product={data.product} productId={productId} />
		</ScrollableScreen>
	);
};

export default Product;
