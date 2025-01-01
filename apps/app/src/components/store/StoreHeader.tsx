import { CustomImage, Typography } from '@habiti/components';
import React from 'react';
import { View, StyleSheet } from 'react-native';

import CategorySelector from './CategorySelector';
import FollowButton from './FollowButton';
import { StoreQuery } from '../../types/api';

interface StoreHeaderProps {
	store: StoreQuery['store'];
	activeCategory: string;
	setActiveCategory: (category: string) => void;
}

const StoreHeader: React.FC<StoreHeaderProps> = ({
	store,
	activeCategory,
	setActiveCategory
}) => {
	return (
		<View style={styles.container}>
			<CustomImage
				uri={store.image?.path}
				height={80}
				width={80}
				style={styles.image}
			/>
			<Typography
				size='xlarge'
				weight='medium'
				style={{ textAlign: 'center', marginTop: 4 }}
			>
				{store.name}
			</Typography>
			<FollowButton storeId={store.id} followed={store.followedByUser} />
			<CategorySelector
				selected={activeCategory}
				categories={store.categories}
				selectCategory={setActiveCategory}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		width: '100%',
		paddingTop: 16
	},
	image: {
		borderRadius: 40,
		alignSelf: 'center'
	}
});

export default StoreHeader;
