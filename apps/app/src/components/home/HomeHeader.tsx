import React from 'react';
import { Icon, Typography, useTheme } from '@habiti/components';
import { Pressable, StyleSheet, TextInput } from 'react-native';
import Animated, {
	FadeInUp,
	FadeOutUp,
	LinearTransition
} from 'react-native-reanimated';

interface HomeHeaderProps {
	searchOpen: boolean;
	setSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
	searchTerm: string;
	setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({
	searchOpen,
	setSearchOpen,
	searchTerm,
	setSearchTerm
}) => {
	const inputRef = React.useRef(null);
	const { theme } = useTheme();

	const handleFocus = React.useCallback(() => {
		setSearchOpen(true);
	}, []);

	const handleBlur = React.useCallback(() => {
		setSearchOpen(false);
	}, []);

	const cancel = React.useCallback(() => {
		inputRef.current?.blur();
		setSearchTerm('');
	}, [inputRef.current]);

	return (
		<Animated.View
			layout={LinearTransition}
			style={[
				styles.container,
				{
					borderBottomWidth: 0.5,
					borderBottomColor: theme.border.color
				}
			]}
		>
			{!searchOpen && (
				<Animated.View
					entering={FadeInUp}
					exiting={FadeOutUp}
					style={{ paddingBottom: 8 }}
				>
					<Typography size='xxlarge' weight='bold'>
						Home
					</Typography>
				</Animated.View>
			)}
			<Animated.View
				layout={LinearTransition}
				style={{ flexDirection: 'row', alignItems: 'center' }}
			>
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
						onChangeText={setSearchTerm} // TODO: Add debounce
						autoCapitalize='none'
						autoCorrect={false}
						selectionColor={theme.text.primary}
						onFocus={handleFocus}
						onBlur={handleBlur}
					/>
				</Animated.View>
				{searchOpen && (
					<Animated.View style={{ marginLeft: 12 }}>
						<Pressable onPress={cancel}>
							<Typography>Cancel</Typography>
						</Pressable>
					</Animated.View>
				)}
			</Animated.View>
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 16,
		paddingTop: 4,
		paddingBottom: 12
	},
	title: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
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

export default HomeHeader;
