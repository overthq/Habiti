import React from 'react';
import { View, StyleSheet, Pressable, TextInput } from 'react-native';
import { Icon, TextButton, Typography, useTheme } from '@habiti/components';

import CategorySelector from './CategorySelector';
import FollowButton from './FollowButton';
import { StoreQuery } from '../../types/api';
import { useNavigation } from '@react-navigation/native';
import Animated, {
	FadeInDown,
	FadeInRight,
	FadeInUp,
	FadeOutDown,
	FadeOutRight,
	FadeOutUp,
	LinearTransition
} from 'react-native-reanimated';

interface StoreHeaderProps {
	store: StoreQuery['store'];
	activeCategory: string;
	setActiveCategory: (category: string) => void;
	searchTerm: string;
	setSearchTerm: (term: string) => void;
}

const StoreHeader: React.FC<StoreHeaderProps> = ({
	store,
	activeCategory,
	setActiveCategory,
	searchTerm,
	setSearchTerm
}) => {
	const [searchOpen, setSearchOpen] = React.useState(false);
	const [canAnimate, setCanAnimate] = React.useState(false);

	const { goBack } = useNavigation();
	const { name, theme } = useTheme();

	const inputRef = React.useRef(null);

	const handleFocus = React.useCallback(() => {
		setSearchOpen(true);
	}, []);

	const handleBlur = React.useCallback(() => {
		setSearchOpen(searchTerm.length > 0);
	}, [searchTerm]);

	const handleOpenSearch = React.useCallback(() => {
		setSearchOpen(true);
		inputRef.current?.focus();
	}, []);

	const handleSearchCancel = React.useCallback(() => {
		inputRef.current?.blur();
		setSearchOpen(false);
		setSearchTerm('');
	}, []);

	const handleLayout = React.useCallback(() => {
		setCanAnimate(true);
	}, []);

	return (
		<Animated.View
			onLayout={handleLayout}
			layout={LinearTransition}
			style={[
				styles.container,
				{
					backgroundColor: theme.screen.background,
					borderBottomWidth: 1,
					borderColor: theme.border.color
				}
			]}
		>
			{!searchOpen && (
				<Animated.View
					entering={canAnimate ? FadeInUp : undefined}
					exiting={FadeOutUp}
				>
					<View style={styles.header}>
						<View style={styles.left}>
							<Pressable style={styles.back} onPress={goBack}>
								<Icon name='chevron-left' size={28} />
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
							<FollowButton
								storeId={store.id}
								followed={store.followedByUser}
							/>
						</View>
					</View>
					<CategorySelector
						selected={activeCategory}
						categories={store.categories}
						selectCategory={setActiveCategory}
					/>
				</Animated.View>
			)}
			{searchOpen && (
				<Animated.View
					entering={FadeInDown}
					exiting={FadeOutDown}
					style={styles.search}
				>
					<Animated.View
						style={[styles.input, { backgroundColor: theme.input.background }]}
						layout={LinearTransition}
					>
						<Icon name='search' size={18} color={theme.text.secondary} />
						<TextInput
							ref={inputRef}
							value={searchTerm}
							placeholder={`Search ${store.name} products`}
							placeholderTextColor={theme.text.secondary}
							inputMode='search'
							style={[styles.inputText, { color: theme.input.text }]}
							onChangeText={setSearchTerm}
							autoCapitalize='none'
							autoCorrect={false}
							autoFocus
							selectionColor={theme.text.primary}
							onFocus={handleFocus}
							onBlur={handleBlur}
							keyboardAppearance={name === 'dark' ? 'dark' : 'light'}
						/>
					</Animated.View>
					<Animated.View
						style={{ marginLeft: 12 }}
						entering={FadeInRight}
						exiting={FadeOutRight}
					>
						<TextButton onPress={handleSearchCancel}>Cancel</TextButton>
					</Animated.View>
				</Animated.View>
			)}
		</Animated.View>
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
	},
	input: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		height: 40,
		borderRadius: 8,
		paddingHorizontal: 12
	},
	inputText: {
		flex: 1,
		marginLeft: 8,
		fontSize: 16,
		height: '100%'
	},
	search: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 16,
		paddingBottom: 12
	}
});

export default StoreHeader;
