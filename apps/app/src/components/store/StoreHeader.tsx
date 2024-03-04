import { CustomImage, Typography } from '@market/components';
import React from 'react';
import { View, StyleSheet } from 'react-native';

import CategorySelector from './CategorySelector';
import FollowButton from './FollowButton';
import { StoreQuery } from '../../types/api';

interface StoreHeaderProps {
	store: StoreQuery['store'];
}

const StoreHeader: React.FC<StoreHeaderProps> = ({ store }) => {
	const handleSelectCategory = React.useCallback(() => {}, []);

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
			<CategorySelector categories={[]} selectCategory={handleSelectCategory} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		width: '100%',
		alignSelf: 'center',
		paddingHorizontal: 8,
		paddingTop: 16,
		paddingBottom: 8
	},
	image: {
		borderRadius: 40,
		alignSelf: 'center'
	}
});

export default StoreHeader;
