import { Icon, TextButton, useTheme } from '@market/components';
import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ExploreHeaderProps {
	searchOpen: boolean;
	setSearchOpen(value: boolean): void;
}

const ExploreHeader: React.FC<ExploreHeaderProps> = ({
	searchOpen,
	setSearchOpen
}) => {
	const { top } = useSafeAreaInsets();
	const { theme } = useTheme();

	const inputRef = React.useRef<TextInput>(null);

	const blurInput = React.useCallback(() => {
		inputRef.current?.blur();
	}, [inputRef.current]);

	const handleBlur = () => {
		setSearchOpen(false);
	};

	const handleFocus = () => {
		setSearchOpen(true);
	};

	return (
		<View style={[styles.container, { paddingTop: top }]}>
			<Animated.View
				style={[styles.input, { backgroundColor: theme.input.background }]}
			>
				<Icon name='search' size={18} color={theme.text.secondary} />
				<TextInput
					ref={inputRef}
					placeholder='Search products and stores'
					placeholderTextColor={theme.text.secondary}
					style={styles.inputText}
					onBlur={handleBlur}
					onFocus={handleFocus}
				/>
			</Animated.View>
			{searchOpen ? (
				<View style={{ marginLeft: 12 }}>
					<TextButton onPress={blurInput}>Cancel</TextButton>
				</View>
			) : null}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 16
	},
	input: {
		flexDirection: 'row',
		flex: 1,
		alignItems: 'center',
		borderRadius: 6,
		padding: 8
	},
	inputText: {
		flex: 1,
		marginLeft: 8,
		fontSize: 16
	}
});

export default ExploreHeader;
