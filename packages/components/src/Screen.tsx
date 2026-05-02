import React from 'react';
import {
	View,
	ScrollView,
	StyleSheet,
	type ViewProps,
	type ScrollViewProps
} from 'react-native';

import { useTheme } from './Theme';

interface ScreenProps extends ViewProps {
	paddingType?: 'sides' | 'all';
	paddingSize?: 'small' | 'medium' | 'large';
}

export const Screen: React.FC<ScreenProps> = props => {
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

interface ScrollableScreenProps extends ScrollViewProps {
	paddingType?: 'sides' | 'all';
	paddingSize?: 'small' | 'medium' | 'large';
}

export const ScrollableScreen: React.FC<ScrollableScreenProps> = props => {
	const { theme } = useTheme();

	return (
		<ScrollView
			keyboardShouldPersistTaps='handled'
			keyboardDismissMode='on-drag'
			{...props}
			contentContainerStyle={{
				flexGrow: 1,
				backgroundColor: theme.screen.background
			}}
			style={[
				{ backgroundColor: theme.screen.background },
				styles.container,
				props.style
			]}
		/>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});
