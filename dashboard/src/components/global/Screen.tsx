import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import useTheme from '../../hooks/useTheme';

// Theme-aware screen component

interface ScreenProps extends ViewProps {
	paddingType?: 'sides' | 'all';
	paddingSize?: 'small' | 'medium' | 'large';
}

const Screen: React.FC<ScreenProps> = props => {
	const theme = useTheme();

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

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

export default Screen;
