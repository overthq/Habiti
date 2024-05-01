import { Typography, SectionHeader } from '@market/components';
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
			{reviews.length === 0 ? (
				<View style={{ paddingHorizontal: 16 }}>
					<Typography variant='secondary' size='small'>
						There are currently no reviews. Be the first to create one.
					</Typography>
				</View>
			) : (
				<View />
			)}
		</View>
	);
};

export default ProductReviews;