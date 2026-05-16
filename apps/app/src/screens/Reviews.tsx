import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Spacer, Typography, useTheme } from '@habiti/components';
import { RouteProp, useRoute } from '@react-navigation/native';

import { useProductReviewsQuery } from '../data/queries';
import { relativeTimestamp } from '../utils/date';
import type { AppStackParamList } from '../navigation/types';
import type { ProductReview } from '../data/types';

const Stars: React.FC<{ rating: number; size?: number }> = ({
	rating,
	size = 14
}) => {
	const { theme } = useTheme();
	const rounded = Math.round(rating);

	return (
		<View style={styles.stars}>
			{[1, 2, 3, 4, 5].map(i => (
				<Typography
					key={i}
					style={{
						fontSize: size,
						color: i <= rounded ? '#F5A623' : theme.text.secondary
					}}
				>
					{i <= rounded ? '★' : '☆'}
				</Typography>
			))}
		</View>
	);
};

const ReviewRow: React.FC<{ review: ProductReview }> = ({ review }) => {
	const { theme } = useTheme();

	return (
		<View style={[styles.row, { backgroundColor: theme.input.background }]}>
			<Stars rating={review.rating} />
			<Spacer y={8} />
			{review.body ? (
				<Typography>{review.body}</Typography>
			) : (
				<Typography variant='secondary'>No written review.</Typography>
			)}
			<Spacer y={8} />
			<Typography variant='secondary' size='small'>
				{review.user?.name ?? 'Anonymous'} ·{' '}
				{relativeTimestamp(review.createdAt)}
			</Typography>
		</View>
	);
};

const Reviews: React.FC = () => {
	const { params } = useRoute<RouteProp<AppStackParamList, 'Reviews'>>();
	const { data, isLoading } = useProductReviewsQuery(params.productId);
	const { theme } = useTheme();

	const reviews = data?.reviews ?? [];

	const average = React.useMemo(() => {
		if (reviews.length === 0) return null;
		const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
		return sum / reviews.length;
	}, [reviews]);

	return (
		<View
			style={[styles.container, { backgroundColor: theme.screen.background }]}
		>
			<FlatList
				data={reviews}
				keyExtractor={r => r.id}
				renderItem={({ item }) => <ReviewRow review={item} />}
				contentContainerStyle={styles.list}
				ItemSeparatorComponent={() => <Spacer y={12} />}
				ListHeaderComponent={
					average != null ? (
						<View style={styles.header}>
							<Stars rating={average} size={18} />
							<Spacer y={4} />
							<Typography size='large' weight='medium'>
								{average.toFixed(1)} · {reviews.length}{' '}
								{reviews.length === 1 ? 'review' : 'reviews'}
							</Typography>
							<Spacer y={16} />
						</View>
					) : null
				}
				ListEmptyComponent={
					<View style={styles.empty}>
						<Typography weight='medium' size='large'>
							{isLoading ? 'Loading reviews…' : 'No reviews yet'}
						</Typography>
						{!isLoading ? (
							<>
								<Spacer y={4} />
								<Typography variant='secondary'>
									Be the first to share your thoughts on this product.
								</Typography>
							</>
						) : null}
					</View>
				}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	list: {
		padding: 16,
		flexGrow: 1
	},
	header: {
		alignItems: 'flex-start'
	},
	row: {
		borderRadius: 8,
		padding: 12
	},
	stars: {
		flexDirection: 'row',
		gap: 2
	},
	empty: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 48
	}
});

export default Reviews;
