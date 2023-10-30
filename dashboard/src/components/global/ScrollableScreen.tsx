import React from 'react';
import { ScrollView, StyleSheet, ScrollViewProps } from 'react-native';
import useTheme from '../../hooks/useTheme';

interface ScrollableScreenProps extends ScrollViewProps {
	paddingType?: 'sides' | 'all';
	paddingSize?: 'small' | 'medium' | 'large';
}

const ScrollableScreen: React.FC<ScrollableScreenProps> = props => {
	const { theme } = useTheme();

	return (
		<ScrollView
			{...props}
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

export default ScrollableScreen;
