import { Typography, SectionHeader } from '@habiti/components';
import React from 'react';
import { View } from 'react-native';

import type { ProductReview } from '../../data/types';

interface ProductReviewsProps {
	reviews: ProductReview[];
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ reviews }) => {
	return (
		<View>
			<SectionHeader title='Reviews' />
			{reviews.length === 0 ? (
				<View style={{ paddingHorizontal: 16 }}>
					<Typography variant='secondary'>
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
