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
					<Pressable
						style={[
							styles.back,
							{ backgroundColor: theme.button.secondary.background }
						]}
						hitSlop={8}
						onPress={goBack}
					>
						<Icon
							name='chevron-left'
							size={20}
							color={theme.text.primary}
							style={{ marginLeft: -1 }}
						/>
					</Pressable>
					<Typography size='xlarge' weight='medium'>
						{store.name}
					</Typography>
				</View>
				<View style={styles.right}>
					<FollowButton storeId={store.id} followed={store.followedByUser} />
					<Pressable
						onPress={handleOpenSearch}
						style={[
							{
								height: 28,
								width: 28,
								borderRadius: 100,
								justifyContent: 'center',
								alignItems: 'center'
							},
							{ backgroundColor: theme.button.secondary.background }
						]}
					>
						<Icon name='search' size={18} color={theme.text.primary} />
					</Pressable>
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
		paddingHorizontal: 16,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	left: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8
	},
	back: {
		height: 24,
		width: 24,
		borderRadius: 100,
		justifyContent: 'center',
		alignItems: 'center'
	},
	right: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8
	}
});

export default StoreHeader;
