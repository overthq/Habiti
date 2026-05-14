import React from 'react';
import { View } from 'react-native';
import { ScrollableScreen, Spacer } from '@habiti/components';

import AddToCart from '../components/product/AddToCart';
import ImageCarousel from '../components/product/ImageCarousel';
import ProductDetails from '../components/product/ProductDetails';
import RelatedProducts from '../components/product/RelatedProducts';
import { ProductProvider } from '../components/product/ProductContext';

const Product = () => {
	return (
		<ProductProvider>
			<View style={{ flex: 1 }}>
				<ScrollableScreen
					contentContainerStyle={{ padding: 0 }}
					showsVerticalScrollIndicator={false}
				>
					<ImageCarousel />
					<Spacer y={16} />
					<ProductDetails />
					<Spacer y={16} />
					<RelatedProducts />
					<Spacer y={16} />
				</ScrollableScreen>
				<AddToCart />
			</View>
		</ProductProvider>
	);
};

export default Product;
