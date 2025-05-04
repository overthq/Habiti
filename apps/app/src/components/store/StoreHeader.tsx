import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Icon, Typography, useTheme } from '@habiti/components';

import CategorySelector from './CategorySelector';
import FollowButton from './FollowButton';
import { StoreQuery } from '../../types/api';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { StoreStackParamList } from '../../types/navigation';

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
	const { navigate } = useNavigation<NavigationProp<StoreStackParamList>>();
	const { goBack } = useNavigation();
	const { theme } = useTheme();

	const handleOpenSearch = () => {
		navigate('Store.Search', { storeId: store.id });
	};

	return (
		<View
			style={[
				styles.container,
				{
					backgroundColor: theme.screen.background,
					borderBottomWidth: 1,
					borderColor: theme.border.color
				}
			]}
		>
			<View style={styles.header}>
				<View style={styles.left}>
					<Pressable style={styles.back} onPress={goBack}>
						<Icon name='chevron-left' size={22} />
					</Pressable>
				</View>
				<View style={styles.center}>
					<Typography
						size='xlarge'
						weight='medium'
						style={{ textAlign: 'center' }}
					>
						{store.name}
					</Typography>
				</View>
				<View style={styles.right}>
					<Pressable onPress={handleOpenSearch}>
						<Icon name='search' size={22} color={theme.text.primary} />
					</Pressable>
					<FollowButton storeId={store.id} followed={store.followedByUser} />
				</View>
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
		paddingHorizontal: 12,
		flexDirection: 'row',
		alignItems: 'center',
		width: '100%'
	},
	left: {
		width: '33.33%',
		flexDirection: 'row',
		alignItems: 'center'
	},
	center: {
		width: '33.33%',
		justifyContent: 'center',
		alignItems: 'center'
	},
	back: {
		justifyContent: 'center',
		alignItems: 'center',
		marginLeft: -4
	},
	right: {
		width: '33.33%',
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
		gap: 12
	}
});

export default StoreHeader;
