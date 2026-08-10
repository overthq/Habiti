import React from 'react';
import { View, StyleSheet, type ViewProps } from 'react-native';
import {
	KeyboardAwareScrollView,
	type KeyboardAwareScrollViewProps
} from 'react-native-keyboard-controller';

import FormToolbar, { KEYBOARD_TOOLBAR_HEIGHT } from './FormToolbar';
import { useTheme } from './Theme';

export const Screen: React.FC<ViewProps> = props => {
	const { theme } = useTheme();

	return (
		<View
			{...props}
			style={[
				{ backgroundColor: theme.screen.background },
				styles.container,
				props.style
			]}
		/>
	);
};

interface ScrollableScreenProps extends KeyboardAwareScrollViewProps {
	// Renders a FormToolbar above the keyboard, and insets the content so the
	// focused input and the end of the content clear it.
	withToolbar?: boolean;
}

export const ScrollableScreen: React.FC<ScrollableScreenProps> = ({
	bottomOffset = 16,
	extraKeyboardSpace = 0,
	withToolbar = false,
	...props
}) => {
	const { theme } = useTheme();
	const toolbarHeight = withToolbar ? KEYBOARD_TOOLBAR_HEIGHT : 0;

	return (
		<>
			<KeyboardAwareScrollView
				keyboardShouldPersistTaps='handled'
				keyboardDismissMode='interactive'
				bottomOffset={bottomOffset + toolbarHeight}
				extraKeyboardSpace={extraKeyboardSpace + toolbarHeight}
				disableScrollOnKeyboardHide
				{...props}
				contentContainerStyle={[
					styles.contentContainer,
					{ backgroundColor: theme.screen.background },
					withToolbar && styles.toolbarContentContainer,
					props.contentContainerStyle
				]}
				style={[
					{ backgroundColor: theme.screen.background },
					styles.scrollContainer,
					props.style
				]}
			/>
			{withToolbar && <FormToolbar />}
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 16
	},
	scrollContainer: {
		flex: 1
	},
	contentContainer: {
		flexGrow: 1,
		paddingHorizontal: 16
	},
	toolbarContentContainer: {
		flexGrow: 0
	}
});
