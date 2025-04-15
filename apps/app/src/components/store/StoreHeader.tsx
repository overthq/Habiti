import { CustomImage, Icon, Typography, useTheme } from '@habiti/components';
import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';

import CategorySelector from './CategorySelector';
import FollowButton from './FollowButton';
import { StoreQuery } from '../../types/api';
import { useNavigation } from '@react-navigation/native';

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
	const { goBack } = useNavigation();
	const { theme } = useTheme();

	return (
		<View
			style={[styles.container, { backgroundColor: theme.screen.background }]}
		>
			<View style={styles.header}>
				<View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
					<Pressable hitSlop={8} onPress={goBack}>
						<Icon name='chevron-left' size={24} color={theme.text.primary} />
					</Pressable>
					<View style={styles.left}>
						<Typography size='large' weight='medium'>
							{store.name}
						</Typography>
					</View>
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
