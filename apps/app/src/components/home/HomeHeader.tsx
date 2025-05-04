import React from 'react';
import { Icon, TextButton, Typography, useTheme } from '@habiti/components';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import Animated, {
	FadeInRight,
	FadeInUp,
	FadeOutRight,
	FadeOutUp,
	LinearTransition
} from 'react-native-reanimated';
import useFirstRender from '../../hooks/useFirstRender';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AppStackParamList } from '../../types/navigation';

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
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();
	const isFirstRender = useFirstRender();

	const inputRef = React.useRef(null);
	const { name, theme } = useTheme();

	const handleFocus = React.useCallback(() => {
		setSearchOpen(true);
	}, []);

	const handleBlur = React.useCallback(() => {
		setSearchOpen(searchTerm.length > 0);
	}, [searchTerm]);

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
					entering={isFirstRender ? undefined : FadeInUp}
					exiting={FadeOutUp}
					style={{
						paddingBottom: 8,
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'space-between'
					}}
				>
					<Typography size='xxlarge' weight='bold'>
						Home
					</Typography>
					<View style={{ gap: 16, flexDirection: 'row' }}>
						<Pressable
							onPress={() => navigate('App.Profile')}
							style={
								[
									// styles.headerButton,
									// { backgroundColor: theme.input.background }
								]
							}
						>
							<Icon name='user-round' />
						</Pressable>
						<Pressable
							onPress={() => navigate('App.Carts')}
							style={
								[
									// styles.headerButton,
									// { backgroundColor: theme.input.background }
								]
							}
						>
							<Icon name='shopping-basket' />
						</Pressable>
					</View>
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
						onChangeText={setSearchTerm}
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
						entering={FadeInRight}
						exiting={FadeOutRight}
					>
						<TextButton onPress={cancel}>Cancel</TextButton>
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
	headerButton: {
		padding: 8,
		borderRadius: 100,
		height: 32,
		width: 32,
		// borderWidth: StyleSheet.hairlineWidth,
		alignItems: 'center',
		justifyContent: 'center'
	}
});

export default HomeHeader;
