import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';

// Theme-aware screen component

interface ScreenProps extends ViewProps {
	paddingType?: 'sides' | 'all';
	paddingSize?: 'small' | 'medium' | 'large';
}

const Screen: React.FC<ScreenProps> = (...props) => {
	return <View style={styles.container} {...props} />;
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

export default Screen;
