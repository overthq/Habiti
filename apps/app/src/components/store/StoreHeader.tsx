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
			<View style={styles.header}>
				<View style={styles.left}>
					<CustomImage
						uri={store.image?.path}
						height={56}
						width={56}
						style={styles.image}
					/>
					<Typography size='large' weight='medium'>
						{store.name}
					</Typography>
				</View>
				<FollowButton storeId={store.id} followed={store.followedByUser} />
			</View>
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
	header: {
		paddingHorizontal: 16,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	left: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	image: {
		borderRadius: 40,
		alignSelf: 'center',
		marginRight: 12
	}
});

export default StoreHeader;
