import { SectionHeader } from '@market/components';
import React from 'react';
import { View } from 'react-native';

import { ProductQuery } from '../../types/api';

interface ProductReviewsProps {
	reviews: ProductQuery['product']['reviews'];
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ reviews }) => {
	return (
		<View>
			<SectionHeader title='Reviews' />
		</View>
	);
};

export default ProductReviews;
