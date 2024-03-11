import { Icon, TextButton, useTheme } from '@market/components';
import {
	useNavigation,
	useRoute,
	useTheme as useNavigationTheme,
	RouteProp,
	NavigationProp
} from '@react-navigation/native';
import React from 'react';
import { StyleSheet, TextInput, Pressable } from 'react-native';
import Animated, {
	FadeIn,
	FadeOut,
	LinearTransition
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ExploreStackParamList } from '../../types/navigation';

interface SearchInputProps {
	inputRef: React.RefObject<TextInput>;
	setFocused(s: boolean): void;
	searchTerm: string;
	setSearchTerm(value: string): void;
}

const SearchInput: React.FC<SearchInputProps> = ({
	inputRef,
	setFocused,
	searchTerm,
	setSearchTerm
}) => {
	const { theme } = useTheme();

	const handleFocus = () => {
		setFocused(true);
	};

	const handleBlur = () => {
		setFocused(false);
	};

	return (
		<Animated.View
			style={[styles.wrapper, { backgroundColor: theme.input.background }]}
			layout={LinearTransition}
		>
			<Icon name='search' size={18} color={theme.text.secondary} />
			<TextInput
				ref={inputRef}
				value={searchTerm}
				onChangeText={setSearchTerm}
				style={[styles.input, { color: theme.text.primary }]}
				placeholder='Search products'
				placeholderTextColor={theme.text.secondary}
				onFocus={handleFocus}
				onBlur={handleBlur}
				autoCapitalize='none'
				autoCorrect={false}
			/>
		</Animated.View>
	);
};

interface SearchStoreHeaderProps {
	searchTerm: string;
	setSearchTerm(value: string): void;
}

const SearchStoreHeader: React.FC<SearchStoreHeaderProps> = ({
	searchTerm,
	setSearchTerm
}) => {
	const { theme } = useTheme();
	const { top } = useSafeAreaInsets();
	const { navigate } = useNavigation<NavigationProp<ExploreStackParamList>>();
	const {
		params: { storeId }
	} = useRoute<RouteProp<ExploreStackParamList>>();
	const navigationTheme = useNavigationTheme();

	const inputRef = React.useRef<TextInput>(null);
	const [focused, setFocused] = React.useState(false);

	const blurInput = React.useCallback(() => {
		inputRef.current?.blur();
	}, [inputRef.current]);

	return (
		<Animated.View
			style={[
				styles.container,
				{
					paddingTop: top + 8,
					borderBottomColor: theme.border.color,
					backgroundColor: navigationTheme.colors.card
				}
			]}
		>
			<Pressable
				onPress={() => navigate('Store', { storeId })}
				style={{ marginLeft: 8 }}
			>
				<Icon name='chevron-left' size={28} />
			</Pressable>
			<SearchInput
				inputRef={inputRef}
				setFocused={setFocused}
				searchTerm={searchTerm}
				setSearchTerm={setSearchTerm}
			/>
			{focused ? (
				<Animated.View
					layout={LinearTransition}
					entering={FadeIn}
					exiting={FadeOut}
					style={{ paddingLeft: 12 }}
				>
					<TextButton onPress={blurInput}>Cancel</TextButton>
				</Animated.View>
			) : null}
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		borderBottomWidth: 0.5,
		paddingRight: 16,
		alignItems: 'center',
		paddingBottom: 8
	},
	wrapper: {
		flex: 1,
		marginLeft: 8,
		borderRadius: 6,
		padding: 8,
		flexDirection: 'row',
		alignItems: 'center'
	},
	input: {
		fontSize: 16,
		marginLeft: 8,
		flex: 1
	}
});

export default SearchStoreHeader;
