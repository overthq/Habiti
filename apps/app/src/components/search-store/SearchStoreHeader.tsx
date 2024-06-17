import { Icon, SearchInput, TextButton, useTheme } from '@habiti/components';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, TextInput, Pressable } from 'react-native';
import Animated, {
	FadeIn,
	FadeOut,
	LinearTransition
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
	const { goBack } = useNavigation();

	const inputRef = React.useRef<TextInput>(null);
	const [focused, setFocused] = React.useState(false);

	const blurInput = React.useCallback(() => {
		inputRef.current?.blur();
	}, [inputRef.current]);

	return (
		<Animated.View
			style={[
				styles.container,
				{ paddingTop: top + 8, borderBottomColor: theme.border.color }
			]}
		>
			<Pressable onPress={goBack} style={{ marginLeft: 8 }}>
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
		paddingBottom: 12
	}
});

export default SearchStoreHeader;
