import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';

import { Icon } from './Icon';
import { useTheme } from './Theme';

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

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		marginLeft: 8,
		borderRadius: 6,
		height: 36,
		paddingHorizontal: 12,
		flexDirection: 'row',
		alignItems: 'center'
	},
	input: {
		fontSize: 16,
		marginLeft: 8,
		flex: 1
	}
});

export default SearchInput;
