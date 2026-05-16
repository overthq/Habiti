import React from 'react';
import {
	View,
	ScrollView,
	StyleSheet,
	type ViewProps,
	type ScrollViewProps
} from 'react-native';

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

export const ScrollableScreen: React.FC<ScrollViewProps> = props => {
	const { theme } = useTheme();

	return (
		<ScrollView
			keyboardShouldPersistTaps='handled'
			keyboardDismissMode='on-drag'
			{...props}
			contentContainerStyle={[
				styles.contentContainer,
				{ backgroundColor: theme.screen.background },
				props.contentContainerStyle
			]}
			style={[
				{ backgroundColor: theme.screen.background },
				styles.scrollContainer,
				props.style
			]}
		/>
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
	}
});
