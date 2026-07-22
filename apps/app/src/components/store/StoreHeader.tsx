import React from 'react';
import { View, StyleSheet, Pressable, TextInput } from 'react-native';
import {
	BottomModal,
	Icon,
	IconButton,
	TextButton,
	Typography,
	useTheme
} from '@habiti/components';

import CategorySelector from './CategorySelector';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import Animated, {
	FadeInDown,
	FadeInRight,
	FadeInUp,
	FadeOutDown,
	FadeOutRight,
	FadeOutUp,
	LinearTransition
} from 'react-native-reanimated';
import useFirstRender from '../../hooks/useFirstRender';

import {
	useFollowStoreMutation,
	useUnfollowStoreMutation
} from '../../data/mutations';
import type { Store } from '../../data/types';
import type { AppStackParamList } from '../../navigation/types';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

interface StoreHeaderProps {
	store: Store;
	followed: boolean;
	activeCategory?: string;
	setActiveCategory: (category: string | undefined) => void;
	searchTerm?: string;
	setSearchTerm: (term: string) => void;
}

const StoreHeader: React.FC<StoreHeaderProps> = ({
	store,
	followed,
	activeCategory,
	setActiveCategory,
	searchTerm,
	setSearchTerm
}) => {
	const [searchOpen, setSearchOpen] = React.useState(false);
	const isFirstRender = useFirstRender();

	const { goBack, navigate } =
		useNavigation<NavigationProp<AppStackParamList>>();
	const { name, theme } = useTheme();

	const handleOpenStoreInfo = React.useCallback(() => {
		navigate('Modal.StoreInfo', { storeId: store.id });
	}, [navigate, store.id]);

	const inputRef = React.useRef<TextInput>(null);

	const expandSearch = React.useCallback(() => {
		setSearchOpen(true);
	}, []);

	const collapseSearchIfEmpty = React.useCallback(() => {
		setSearchOpen((searchTerm?.length ?? 0) > 0);
	}, [searchTerm]);

	const handleOpenSearch = React.useCallback(() => {
		setSearchOpen(true);
		inputRef.current?.focus();
	}, []);

	const handleSearchCancel = React.useCallback(() => {
		inputRef.current?.blur();
		setSearchOpen(false);
		setSearchTerm('');
	}, [setSearchTerm]);

	return (
		<Animated.View
			layout={LinearTransition}
			style={[
				styles.container,
				{
					backgroundColor: theme.screen.background,
					borderBottomWidth: StyleSheet.hairlineWidth,
					borderColor: theme.border.color
				}
			]}
		>
			{!searchOpen && (
				<Animated.View
					entering={isFirstRender ? undefined : FadeInUp}
					exiting={FadeOutUp}
				>
					<View style={styles.header}>
						<View style={styles.left}>
							<Pressable style={styles.back} onPress={goBack}>
								<Icon name='chevron-left' size={28} />
							</Pressable>
							<Typography
								size='large'
								weight='medium'
								ellipsize
								style={styles.storeName}
							>
								{store.name}
							</Typography>
							{store.unlisted && (
								<Icon name='eye-off' size={18} color={theme.text.secondary} />
							)}
						</View>
						<View style={styles.right}>
							<FollowButton storeId={store.id} followed={followed} />

							<IconButton
								name='search'
								size={22}
								color={theme.text.primary}
								onPress={handleOpenSearch}
								inset
							/>

							<IconButton
								name='more-vertical'
								size={22}
								onPress={handleOpenStoreInfo}
								inset
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
							onFocus={expandSearch}
							onBlur={collapseSearchIfEmpty}
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

interface FollowButtonProps {
	storeId: string;
	followed: boolean;
}

const FollowButton: React.FC<FollowButtonProps> = ({ storeId, followed }) => {
	const { theme } = useTheme();
	const followStore = useFollowStoreMutation(storeId);
	const unfollowStore = useUnfollowStoreMutation(storeId);

	const handlePress = React.useCallback(() => {
		if (followed) {
			unfollowStore.mutate();
		} else {
			followStore.mutate();
		}
	}, [followed, followStore, unfollowStore]);

	return (
		<Pressable
			hitSlop={8}
			onPress={handlePress}
			style={[
				styles.followPill,
				{
					backgroundColor: followed
						? theme.input.background
						: theme.button.primary.background
				}
			]}
		>
			<Typography
				size='small'
				weight='medium'
				style={{
					color: followed ? theme.text.secondary : theme.button.primary.text
				}}
			>
				{followed ? 'Following' : 'Follow'}
			</Typography>
		</Pressable>
	);
};

interface StoreMenuModalProps {
	modalRef: React.RefObject<BottomSheetModal>;
}

const StoreMenuModal = ({ modalRef }: StoreMenuModalProps) => {
	return (
		<BottomModal modalRef={modalRef}>
			<Pressable>
				<Typography>Search store</Typography>
			</Pressable>
			<Pressable>
				<Typography>Follow store</Typography>
			</Pressable>
			<Pressable>
				<Typography>Store details</Typography>
			</Pressable>
			<Pressable>
				<Typography>Share</Typography>
			</Pressable>
		</BottomModal>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingTop: 16,
		marginHorizontal: -16
	},
	header: {
		paddingHorizontal: 12,
		flexDirection: 'row',
		alignItems: 'center',
		width: '100%'
	},
	left: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8
	},
	storeName: {
		flexShrink: 1
	},
	back: {
		justifyContent: 'center',
		alignItems: 'center',
		marginLeft: -4
	},
	right: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
		gap: 12,
		marginLeft: 12
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
	},
	followPill: {
		paddingHorizontal: 14,
		paddingVertical: 6,
		borderRadius: 999
	}
});

export default StoreHeader;
