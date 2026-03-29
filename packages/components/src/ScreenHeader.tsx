import React from 'react';
import { View, Pressable, StyleSheet, TextInput } from 'react-native';
import Animated, {
	FadeInUp,
	FadeOutUp,
	LinearTransition
} from 'react-native-reanimated';

import { Icon } from './Icon';
import { useTheme } from './Theme';
import Typography from './Typography';
import TextButton from './TextButton';

interface SearchProps {
	placeholder: string;
	value: string;
	onChangeText: (text: string) => void;
}

interface ScreenHeaderProps extends React.PropsWithChildren {
	title: string;
	hasBottomBorder?: boolean;
	search?: SearchProps;
	right?: React.ReactNode;
	goBack?: () => void;
}

const ScreenHeader: React.FC<ScreenHeaderProps> = ({
	title,
	search,
	right,
	goBack,
	children,
	hasBottomBorder = false
}) => {
	const { name, theme } = useTheme();
	const [searchOpen, setSearchOpen] = React.useState(false);
	const inputRef = React.useRef<TextInput>(null);
	const isFirstRender = React.useRef(true);

	React.useEffect(() => {
		isFirstRender.current = false;
	}, []);

	const handleFocus = React.useCallback(() => {
		setSearchOpen(true);
	}, []);

	const handleBlur = React.useCallback(() => {
		if (search) {
			setSearchOpen(search.value.length > 0);
		}
	}, [search?.value]);

	const cancel = React.useCallback(() => {
		inputRef.current?.blur();
		search?.onChangeText('');
	}, [search?.onChangeText]);

	return (
		<Animated.View
			layout={LinearTransition}
			style={[
				styles.container,
				hasBottomBorder
					? {
							borderBottomWidth: StyleSheet.hairlineWidth,
							borderBottomColor: theme.border.color
						}
					: {}
			]}
		>
			{(!search || !searchOpen) && (
				<Animated.View
					entering={isFirstRender.current ? undefined : FadeInUp}
					exiting={search ? FadeOutUp : undefined}
					style={styles.title}
				>
					<View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
						{goBack && (
							<Pressable hitSlop={8} onPress={goBack}>
								<Icon name='arrow-left' size={20} color={theme.text.primary} />
							</Pressable>
						)}
						<Typography size='xxlarge' weight='bold'>
							{title}
						</Typography>
					</View>
					{right}
				</Animated.View>
			)}
			{search && (
				<Animated.View layout={LinearTransition} style={styles.searchRow}>
					<Animated.View
						layout={LinearTransition}
						style={[
							styles.searchInput,
							{ backgroundColor: theme.input.background }
						]}
					>
						<Icon name='search' size={18} color={theme.text.secondary} />
						<TextInput
							ref={inputRef}
							value={search.value}
							placeholder={search.placeholder}
							placeholderTextColor={theme.text.secondary}
							inputMode='search'
							style={[styles.inputText, { color: theme.input.text }]}
							onChangeText={search.onChangeText}
							autoCapitalize='none'
							autoCorrect={false}
							selectionColor={theme.text.primary}
							onFocus={handleFocus}
							onBlur={handleBlur}
							keyboardAppearance={name === 'dark' ? 'dark' : 'light'}
						/>
					</Animated.View>
					{searchOpen && (
						<Animated.View
							style={{ marginLeft: 12 }}
							entering={isFirstRender.current ? undefined : FadeInUp}
							exiting={FadeOutUp}
						>
							<TextButton onPress={cancel}>Cancel</TextButton>
						</Animated.View>
					)}
				</Animated.View>
			)}
			{children}
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 16,
		paddingVertical: 12
	},
	title: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingBottom: 8
	},
	searchRow: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	searchInput: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		height: 40,
		borderRadius: 8,
		paddingHorizontal: 12,
		gap: 8
	},
	inputText: {
		flex: 1,
		fontSize: 16,
		height: '100%'
	}
});

export default ScreenHeader;
