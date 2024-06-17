import { Icon, TextButton, useTheme } from '@habiti/components';
import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Animated, {
	FadeIn,
	FadeOut,
	LinearTransition
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ExploreHeaderProps {
	searchOpen: boolean;
	setSearchOpen(value: boolean): void;
	searchTerm: string;
	setSearchTerm(value: string): void;
}

const ExploreHeader: React.FC<ExploreHeaderProps> = ({
	searchOpen,
	setSearchOpen,
	searchTerm,
	setSearchTerm
}) => {
	const { top } = useSafeAreaInsets();
	const { theme } = useTheme();

	const inputRef = React.useRef<TextInput>(null);

	const cancel = React.useCallback(() => {
		inputRef.current?.blur();
		setSearchTerm('');
		setSearchOpen(false);
	}, [inputRef.current]);

	const handleFocus = () => {
		setSearchOpen(true);
	};

	return (
		<View style={[styles.container, { paddingTop: top + 8 }]}>
			<Animated.View
				style={[styles.input, { backgroundColor: theme.input.background }]}
				layout={LinearTransition}
			>
				<Icon name='search' size={18} color={theme.text.secondary} />
				<TextInput
					ref={inputRef}
					value={searchTerm}
					placeholder='Search products and stores'
					placeholderTextColor={theme.text.secondary}
					inputMode='search'
					style={[styles.inputText, { color: theme.input.text }]}
					onFocus={handleFocus}
					onChangeText={setSearchTerm} // TODO: Add debounce
					autoCapitalize='none'
					autoCorrect={false}
					selectionColor={theme.text.primary}
				/>
			</Animated.View>
			{searchOpen ? (
				<Animated.View
					entering={FadeIn.delay(50)}
					exiting={FadeOut}
					style={{ marginLeft: 12 }}
				>
					<TextButton onPress={cancel}>Cancel</TextButton>
				</Animated.View>
			) : null}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 16,
		paddingBottom: 12
	},
	input: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		height: 36,
		borderRadius: 6,
		paddingHorizontal: 12
	},
	inputText: {
		flex: 1,
		marginLeft: 8,
		fontSize: 16,
		height: '100%'
	}
});

export default ExploreHeader;
